import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import cupIcon from './assets/cup-of-coffee-icon.svg';
import addIcon from './assets/add.svg';
import closeIcon from './assets/close.svg';
import deleteIcon from './assets/delete.svg';
import dropdownIcon from './assets/dropdown menu.svg';
import menuIcon from './assets/menu.svg';
import searchIcon from './assets/search.svg';
import starIcon from './assets/star.svg';
import { FLAVOR_WHEEL, ALL_FLAVORS, getFlavorName } from './flavorWheel';

const PAGES = ['Home', 'Beans', 'Log Brew', 'Journal'];
const ROAST_FILTERS = ['All', 'Light', 'Medium', 'Medium Dark', 'Dark'];
const GRIND_SIZES = ['Extra-Fine', 'Fine', 'Medium-Fine', 'Medium', 'Medium-Coarse', 'Coarse', 'Extra-Coarse'];

const CUPPING_TRAITS = [
  { key: 'acidity', label: 'Acidity', left: 'Flat / Sour', right: 'Crisp / Bright' },
  { key: 'sweetness', label: 'Sweetness', left: 'Bitter', right: 'Sweet / Syrupy' },
  { key: 'body', label: 'Body', left: 'Thin / Watery', right: 'Heavy / Creamy' },
  { key: 'balance', label: 'Balance', left: 'Disjointed', right: 'Harmonious' },
];

const EMPTY_LOG = {
  dose: '18',
  yieldG: '36',
  grind: 'Medium',
  temp: '92',
  time: '3:15',
  rating: 4,
  notes: '',
  acidity: 3,
  sweetness: 3,
  body: 3,
  balance: 3,
  flavorTags: [],
};

const EMPTY_BEAN = { name: '', roasterName: '', origin: '', roastDate: '', roast: 'Medium roast' };

function useLocalStorage(key, startValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : startValue;
    } catch (err) {
      console.warn('Could not read from localStorage:', err);
      return startValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('Could not save to localStorage:', err);
    }
  }, [key, value]);

  return [value, setValue];
}

// Guests have no database, This one makes ids for the guests
function makeGuestId() {
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatToday() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function beanFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    roasterName: row.roaster_name,
    origin: row.origin,
    roastDate: row.roast_date,
    roast: row.roast,
  };
}

function beanToDb(bean) {
  return {
    name: bean.name,
    roaster_name: bean.roasterName,
    origin: bean.origin,
    roast_date: bean.roastDate || null,
    roast: bean.roast,
  };
}

function logFromDb(row) {
  return {
    id: row.id,
    beanName: row.bean_name,
    date: row.date,
    dose: row.dose,
    yieldG: row.yield_g,
    grind: row.grind,
    temp: row.temp,
    time: row.time,
    ratio: row.ratio,
    rating: row.rating,
    roast: row.roast,
    notes: row.notes ?? '',
    acidity: row.acidity ?? 3,
    sweetness: row.sweetness ?? 3,
    body: row.body ?? 3,
    balance: row.balance ?? 3,
    flavorTags: row.flavor_tags ?? [],
  };
}

function logToDb(log) {
  return {
    bean_name: log.beanName,
    date: log.date,
    dose: log.dose,
    yield_g: log.yieldG,
    grind: log.grind,
    temp: log.temp,
    time: log.time,
    ratio: log.ratio,
    rating: log.rating,
    roast: log.roast,
    notes: log.notes,
    acidity: log.acidity,
    sweetness: log.sweetness,
    body: log.body,
    balance: log.balance,
    flavor_tags: log.flavorTags,
  };
}

function Button({ variant = 'primary', size, className = '', onClick, children, type = 'button', icon, disabled }) {
  let classes = `btn btn-${variant}`;
  if (size) classes += ` btn-${size}`;
  if (className) classes += ` ${className}`;

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {icon && <img src={icon} alt="" className="icon-img-sm" />}
      {children}
    </button>
  );
}

function Input({ value, onChange, placeholder, type = 'text', min, max, step }) {
  return (
    <input
      type={type}
      className="input-control"
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
    />
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      className="input-control select-control"
      value={value}
      onChange={onChange}
      style={{ '--dropdown-icon': `url("${dropdownIcon}")` }}
    >
      {children}
    </select>
  );
}

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

// loading
function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

function FormField({ label, error, children }) {
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-icon">
        <img src={searchIcon} alt="" className="icon-img" />
      </span>
      <input
        type="text"
        className="input-control"
        value={value}
        onChange={onChange}
        placeholder="Search by bean or tasting notes..."
        aria-label="Search brews"
      />
    </div>
  );
}

function StarIcon({ filled }) {
  return (
    <span
      className={filled ? 'star-icon is-filled' : 'star-icon'}
      style={{ WebkitMaskImage: `url("${starIcon}")`, maskImage: `url("${starIcon}")` }}
      aria-hidden="true"
    />
  );
}

function StarRating({ rating = 0, onRatingChange, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];

  if (readOnly) {
    return (
      <div className="star-rating read-only" aria-label={`Rated ${rating} out of 5`}>
        {stars.map((star) => (
          <StarIcon key={star} filled={star <= rating} />
        ))}
      </div>
    );
  }

  return (
    <div className="star-rating" role="radiogroup" aria-label="Rating">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === rating}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onRatingChange(star)}
        >
          <StarIcon filled={star <= rating} />
        </button>
      ))}
    </div>
  );
}

function BrewLogCard({ log, onClick }) {
  return (
    <div
      className="brew-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick();
      }}
    >
      <div>
        <div className="card-title">{log.beanName}</div>
        <div className="card-meta">
          {log.date} · {log.dose}g → {log.yieldG}g · {log.time}
        </div>
      </div>
      <StarRating rating={log.rating} readOnly />
    </div>
  );
}

// Shows the five dots under the cupping slider/bar
function CuppingTicks({ value }) {
  return (
    <div className="cupping-ticks" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((step) => (
        <span key={step} className={step <= value ? 'cupping-tick is-filled' : 'cupping-tick'} />
      ))}
    </div>
  );
}

function CuppingSlider({ label, leftLabel, rightLabel, value, onChange }) {
  const fillPercent = ((value - 1) / 4) * 100;

  return (
    <div className="cupping-slider">
      <div className="cupping-slider-header">
        <span className="cupping-slider-label">{label}</span>
        <span className="cupping-slider-value">{value}/5</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cupping-range"
        style={{ '--fill': `${fillPercent}%` }}
        aria-label={label}
      />
      <CuppingTicks value={value} />
      <div className="cupping-slider-ends">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

function CuppingBar({ label, leftLabel, rightLabel, value }) {
  const fillPercent = ((value - 1) / 4) * 100;

  return (
    <div className="cupping-slider read-only">
      <div className="cupping-slider-header">
        <span className="cupping-slider-label">{label}</span>
        <span className="cupping-slider-value">{value}/5</span>
      </div>
      <div className="cupping-bar-track">
        <div className="cupping-bar-fill" style={{ width: `${fillPercent}%` }} />
      </div>
      <CuppingTicks value={value} />
      <div className="cupping-slider-ends">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

function FlavorPicker({ selected = [], onChange }) {
  const [search, setSearch] = useState('');
  const [openCategory, setOpenCategory] = useState(null);

  function toggleTag(path) {
    if (selected.includes(path)) {
      onChange(selected.filter((tag) => tag !== path));
    } else {
      onChange([...selected, path]);
    }
  }

  const searchText = search.trim().toLowerCase();

  let flavorsToShow = [];
  if (searchText) {
    flavorsToShow = ALL_FLAVORS.filter((f) => f.flavor.toLowerCase().includes(searchText)).slice(0, 12);
  } else if (openCategory) {
    flavorsToShow = ALL_FLAVORS.filter((f) => f.category === openCategory);
  }

  const chips = flavorsToShow.map((f) => (
    <button
      key={f.path}
      type="button"
      className={selected.includes(f.path) ? 'flavor-chip is-selected' : 'flavor-chip'}
      onClick={() => toggleTag(f.path)}
    >
      {f.flavor} <span className="flavor-chip-path">{f.subcategory}</span>
    </button>
  ));

  return (
    <div className="flavor-picker">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasting notes (e.g. blueberry, caramel, jasmine)…"
      />

      {searchText ? (
        <div className="flavor-results">
          {chips.length === 0 ? <p className="card-meta">No matching notes.</p> : chips}
        </div>
      ) : (
        <>
          <div className="filter-pills">
            {Object.keys(FLAVOR_WHEEL).map((category) => (
              <button
                key={category}
                type="button"
                className={openCategory === category ? 'pill active' : 'pill'}
                onClick={() => setOpenCategory(openCategory === category ? null : category)}
              >
                {category}
              </button>
            ))}
          </div>
          {openCategory && <div className="flavor-results">{chips}</div>}
        </>
      )}

      {selected.length > 0 && (
        <div className="flavor-selected">
          {selected.map((path) => (
            <span key={path} className="flavor-tag-badge">
              {getFlavorName(path)}
              <button type="button" onClick={() => toggleTag(path)} aria-label={`Remove ${getFlavorName(path)}`}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Banner/Toast message
function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <div className="toast-viewport">
      <div className={`toast toast-${toast.tone}`} role="status">
        <span>{toast.message}</span>
        <button type="button" className="icon-btn" onClick={onDismiss} aria-label="Dismiss">
          <img src={closeIcon} alt="" className="icon-img" />
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <span className="footer-brand">
          <img src={cupIcon} alt="" className="icon-img-sm" />
          Coffee Brew Journal
        </span>
        <div className="footer-links">
          <a className="footer-link" href="https://www.linkedin.com/in/bacani-cyril-cris-t-084b8b329/">
            LinkedIn
          </a>
          <a className="footer-link" href="https://github.com/cyy-ril" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span className="footer-link footer-copyright">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

function Navbar({ currentPage, onNavigate, onSignOut, isGuest }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const signOutText = isGuest ? 'Exit guest mode' : 'Log out';

  function goToPage(page) {
    onNavigate(page);
    setMenuOpen(false);
  }

  function signOut() {
    onSignOut();
    setMenuOpen(false);
  }

  return (
    <header>
      {isGuest && (
        <div className="guest-banner">You're browsing as a guest — brews are saved on this device only.</div>
      )}

      <nav className="navbar">
        <div className="nav-brand">
          <div className="nav-logo">
            <img src={cupIcon} alt="Coffee Brew Journal logo" />
          </div>
          <span>Coffee Brew Journal</span>
        </div>

        <div className="nav-links desktop-nav">
          {PAGES.map((page) => (
            <button
              key={page}
              className={currentPage === page ? 'nav-link active' : 'nav-link'}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}
          <button className="nav-link" onClick={signOut}>
            {signOutText}
          </button>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
        >
          <img src={menuOpen ? closeIcon : menuIcon} alt="" className="icon-img-lg" />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-nav">
          {PAGES.map((page) => (
            <button
              key={page}
              className={currentPage === page ? 'nav-link active' : 'nav-link'}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}
          <button className="nav-link" onClick={signOut}>
            {signOutText}
          </button>
        </div>
      )}
    </header>
  );
}

export default function App() {
  // Login
  const [session, setSession] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);

  // Guest mode (the data only stays in the users browser)
  const [guestMode, setGuestMode] = useLocalStorage('coffeeBrewJournal:guestMode', false);
  const [guestBeans, setGuestBeans] = useLocalStorage('coffeeBrewJournal:guestBeans', []);
  const [guestLogs, setGuestLogs] = useLocalStorage('coffeeBrewJournal:guestLogs', []);

  // Data from Supabase (logged in users)
  const [dbBeans, setDbBeans] = useState([]);
  const [dbLogs, setDbLogs] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Banner/Toast message
  const [toast, setToast] = useState(null);

  // Page and selections
  const [currentPage, setCurrentPage] = useLocalStorage('coffeeBrewJournal:activeRoute', 'Home');
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [selectedBeanId, setSelectedBeanId] = useState('');

  // Forms
  const [logForm, setLogForm] = useLocalStorage('coffeeBrewJournal:newLog', EMPTY_LOG);
  const [beanForm, setBeanForm] = useLocalStorage('coffeeBrewJournal:newBean', EMPTY_BEAN);
  const [showBeanForm, setShowBeanForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null); // null means adding a new one
  const [editingBean, setEditingBean] = useState(null);

  // Journal search with a filter and sort
  const [search, setSearch] = useState('');
  const [roastFilter, setRoastFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  // This use the database data if logged in, otherwise its guest data
  const beans = session ? dbBeans : guestBeans;
  const logs = session ? dbLogs : guestLogs;
  const setBeans = session ? setDbBeans : setGuestBeans;
  const setLogs = session ? setDbLogs : setGuestLogs;

  function showToast(message, tone = 'error') {
    setToast({ message, tone });
  }

  // Hide the banner/toast after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // This checks if someone is logged in, and is used for login/logout
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingLogin(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) setGuestMode(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // This load the beans and logs from the Supabase when the login changes
  useEffect(() => {
    if (!session) {
      setDbBeans([]);
      setDbLogs([]);
      return;
    }

    setDataLoading(true);
    Promise.all([
      supabase.from('beans').select('*').order('created_at', { ascending: true }),
      supabase.from('logs').select('*').order('created_at', { ascending: false }),
    ]).then(([beansResult, logsResult]) => {
      if (beansResult.error) {
        console.error('Could not load beans:', beansResult.error);
        showToast("Couldn't load your bean library. Try refreshing the page.");
      } else {
        setDbBeans(beansResult.data.map(beanFromDb));
      }

      if (logsResult.error) {
        console.error('Could not load logs:', logsResult.error);
        showToast("Couldn't load your brew journal. Try refreshing the page.");
      } else {
        setDbLogs(logsResult.data.map(logFromDb));
      }

      setDataLoading(false);
    });
  }, [session]);

  // This one make sure that the selected bean still exists
  useEffect(() => {
    if (beans.length > 0 && !beans.some((b) => b.id === selectedBeanId)) {
      setSelectedBeanId(beans[0].id);
    }
  }, [beans, selectedBeanId]);

  function updateLogForm(field, value) {
    setLogForm({ ...logForm, [field]: value });
  }

  function updateBeanForm(field, value) {
    setBeanForm({ ...beanForm, [field]: value });
  }

  function startEditLog(log) {
    const matchingBean = beans.find((b) => b.name === log.beanName);
    if (matchingBean) setSelectedBeanId(matchingBean.id);

    setEditingLog(log);
    setLogForm({
      dose: log.dose,
      yieldG: log.yieldG,
      grind: log.grind,
      temp: log.temp,
      time: log.time,
      rating: log.rating,
      notes: log.notes,
      acidity: log.acidity,
      sweetness: log.sweetness,
      body: log.body,
      balance: log.balance,
      flavorTags: log.flavorTags,
    });
    setCurrentPage('Log Brew');
  }

  function cancelLogForm() {
    setEditingLog(null);
    setLogForm(EMPTY_LOG);
    setCurrentPage('Home');
  }

  function startEditBean(bean) {
    setEditingBean(bean);
    setBeanForm({
      name: bean.name,
      roasterName: bean.roasterName || '',
      origin: bean.origin || '',
      roastDate: bean.roastDate || '',
      roast: bean.roast,
    });
    setShowBeanForm(true);
  }

  function cancelBeanForm() {
    setShowBeanForm(false);
    setEditingBean(null);
    setBeanForm(EMPTY_BEAN);
  }

  // This is for Save and delete
  async function handleSaveLog(e) {
    e.preventDefault();

    const bean = beans.find((b) => b.id === selectedBeanId) || beans[0];
    if (!bean) return;

    const dose = parseFloat(logForm.dose) || 0;
    const yieldG = parseFloat(logForm.yieldG) || 0;
    const ratio = dose > 0 ? (yieldG / dose).toFixed(1) : '0';

    const logData = {
      ...logForm,
      beanName: bean.name,
      date: editingLog ? editingLog.date : formatToday(), // This will keep the old date when editing
      ratio: `1:${ratio}`,
      roast: bean.roast.replace(' roast', ''),
    };

    if (session) {
      const dbLog = logToDb(logData);
      let result;
      if (editingLog) {
        result = await supabase.from('logs').update(dbLog).eq('id', editingLog.id).select().single();
      } else {
        result = await supabase.from('logs').insert(dbLog).select().single();
      }

      if (result.error) {
        console.error('Could not save brew log:', result.error);
        showToast("Couldn't save that brew log. Please try again.");
        return;
      }

      const savedLog = logFromDb(result.data);
      if (editingLog) {
        setLogs(logs.map((log) => (log.id === editingLog.id ? savedLog : log)));
      } else {
        setLogs([savedLog, ...logs]);
      }
    } else if (editingLog) {
      setLogs(logs.map((log) => (log.id === editingLog.id ? { id: editingLog.id, ...logData } : log)));
    } else {
      setLogs([{ id: makeGuestId(), ...logData }, ...logs]);
    }

    showToast(editingLog ? 'Brew log updated.' : 'Brew log saved.', 'success');
    setLogForm(EMPTY_LOG);
    setEditingLog(null);
    setCurrentPage('Journal');
  }

  async function handleDeleteLog(id) {
    if (!window.confirm("Delete this brew log? This can't be undone.")) return;

    if (session) {
      const { error } = await supabase.from('logs').delete().eq('id', id);
      if (error) {
        console.error('Could not delete brew log:', error);
        showToast("Couldn't delete that brew log. Please try again.");
        return;
      }
    }

    setLogs(logs.filter((log) => log.id !== id));
    setSelectedLogId(null);
    showToast('Brew log deleted.', 'success');
  }

  async function handleSaveBean(e) {
    e.preventDefault();
    if (!beanForm.name.trim()) return;

    const beanData = {
      name: beanForm.name.trim(),
      roasterName: beanForm.roasterName.trim() || 'Unknown roaster',
      origin: beanForm.origin.trim(),
      roastDate: beanForm.roastDate,
      roast: beanForm.roast,
    };

    let savedBean;
    if (session) {
      const dbBean = beanToDb(beanData);
      let result;
      if (editingBean) {
        result = await supabase.from('beans').update(dbBean).eq('id', editingBean.id).select().single();
      } else {
        result = await supabase.from('beans').insert(dbBean).select().single();
      }

      if (result.error) {
        console.error('Could not save bean:', result.error);
        showToast("Couldn't save that bean. Please try again.");
        return;
      }
      savedBean = beanFromDb(result.data);
    } else {
      savedBean = { id: editingBean ? editingBean.id : makeGuestId(), ...beanData };
    }

    if (editingBean) {
      setBeans(beans.map((b) => (b.id === savedBean.id ? savedBean : b)));
    } else {
      setBeans([...beans, savedBean]);
    }

    setSelectedBeanId(savedBean.id);
    setBeanForm(EMPTY_BEAN);
    setEditingBean(null);
    setShowBeanForm(false);
    showToast(editingBean ? 'Bean updated.' : 'Bean added.', 'success');
  }

  async function handleDeleteBean(id) {
    if (!window.confirm('Remove this bean from your library?')) return;

    if (session) {
      const { error } = await supabase.from('beans').delete().eq('id', id);
      if (error) {
        console.error('Could not delete bean:', error);
        showToast("Couldn't delete that bean. Please try again.");
        return;
      }
    }

    const remainingBeans = beans.filter((b) => b.id !== id);
    setBeans(remainingBeans);

    // If the selected bean was deleted, pick the first one left
    if (selectedBeanId === id) {
      setSelectedBeanId(remainingBeans.length > 0 ? remainingBeans[0].id : '');
    }
    showToast('Bean removed.', 'success');
  }

  function handleSignOut() {
    if (session) {
      supabase.auth.signOut();
    } else {
      setGuestMode(false);
      setSelectedLogId(null);
      setSelectedBeanId('');
    }
  }

  let averageRating = '—';
  if (logs.length > 0) {
    const totalRating = logs.reduce((sum, log) => sum + log.rating, 0);
    averageRating = (totalRating / logs.length).toFixed(1);
  }

  // Journal list: filter first, then sort (logs are already newest first)
  const searchText = search.toLowerCase();
  const filteredLogs = logs.filter((log) => {
    const roastMatches = roastFilter === 'All' || log.roast === roastFilter;
    const textMatches =
      log.beanName.toLowerCase().includes(searchText) || log.notes.toLowerCase().includes(searchText);
    return roastMatches && textMatches;
  });

  const sortedLogs = [...filteredLogs];
  if (sortBy === 'date-asc') {
    sortedLogs.reverse();
  } else if (sortBy === 'rating-desc') {
    sortedLogs.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'rating-asc') {
    sortedLogs.sort((a, b) => a.rating - b.rating);
  }

  // The log opened in the journal
  const selectedLog = logs.find((log) => log.id === selectedLogId);

  let metrics = [];
  if (selectedLog) {
    metrics = [
      { label: 'Dose', value: `${selectedLog.dose}g` },
      { label: 'Yield', value: `${selectedLog.yieldG}g` },
      { label: 'Grind', value: selectedLog.grind },
      { label: 'Water', value: `${selectedLog.temp}°C` },
      { label: 'Time', value: selectedLog.time },
      { label: 'Ratio', value: selectedLog.ratio },
    ];
  }

  if (checkingLogin) {
    return (
      <div className="app-container">
        <Skeleton className="skeleton-line skeleton-title" />
        <Skeleton className="skeleton-line skeleton-subtitle" />
        <Skeleton className="skeleton-card" />
        <Skeleton className="skeleton-card" />
      </div>
    );
  }

  if (!session && !guestMode) {
    return (
      <div className="app-container">
        <Auth onGuest={() => setGuestMode(true)} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Toast toast={toast} onDismiss={() => setToast(null)} />
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onSignOut={handleSignOut}
        isGuest={!session}
      />

      <main>
        {dataLoading ? (
          <div>
            <div className="stats-grid">
              <Skeleton className="skeleton-stat" />
              <Skeleton className="skeleton-stat" />
              <Skeleton className="skeleton-stat" />
            </div>
            <Skeleton className="skeleton-card" />
            <Skeleton className="skeleton-card" />
            <Skeleton className="skeleton-card" />
          </div>
        ) : (
          <>
            {/* Home */}
            {currentPage === 'Home' && (
              <section>
                <h1 className="screen-title">Good day. What's brewing today?</h1>
                <p className="screen-subtitle">From your first shot to your best shot.</p>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{logs.length}</div>
                    <div className="stat-label">Total brews logged</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{averageRating}</div>
                    <div className="stat-label">Average rating</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{beans.length}</div>
                    <div className="stat-label">Beans in library</div>
                  </div>
                </div>

                <h2 className="section-heading">Recent brews</h2>
                {logs.length === 0 ? (
                  <div className="empty-state mb-16">
                    <p>No brews yet.</p>
                    <p>Log your first one to start building your journal.</p>
                  </div>
                ) : (
                  <div className="card-list mb-16">
                    {logs.slice(0, 3).map((log) => (
                      <BrewLogCard
                        key={log.id}
                        log={log}
                        onClick={() => {
                          setSelectedLogId(log.id);
                          setCurrentPage('Journal');
                        }}
                      />
                    ))}
                  </div>
                )}

                <Button variant="accent" icon={addIcon} onClick={() => setCurrentPage('Log Brew')}>
                  Add a brew
                </Button>
              </section>
            )}

            {/* Beans */}
            {currentPage === 'Beans' && (
              <section>
                <h1 className="screen-title">Bean library</h1>
                <p className="screen-subtitle">The beans are now in hand, ready to brew.</p>

                {beans.length === 0 ? (
                  <div className="empty-state mb-16">
                    <p>No beans yet.</p>
                    <p>Add your first bag to start logging brews.</p>
                  </div>
                ) : (
                  <div className="beans-grid mb-16">
                    {beans.map((bean) => (
                      <div key={bean.id} className="bean-card">
                        <div className="bean-card-inner">
                          <div className="bean-card-row">
                            <div className="card-title">{bean.name}</div>
                            <button
                              type="button"
                              className="icon-btn danger"
                              aria-label={`Delete ${bean.name}`}
                              onClick={() => handleDeleteBean(bean.id)}
                            >
                              <img src={deleteIcon} alt="" className="icon-img" />
                            </button>
                          </div>
                          <div className="card-meta mb-4">
                            {bean.roasterName}
                            {bean.origin ? ` · ${bean.origin}` : ''}
                          </div>
                          {bean.roastDate && <div className="card-meta mb-8">Roasted {bean.roastDate}</div>}
                          <Badge>{bean.roast}</Badge>
                          <div className="button-row bean-buttons">
                            <Button
                              variant="secondary"
                              size="small"
                              onClick={() => {
                                setSelectedBeanId(bean.id);
                                setCurrentPage('Log Brew');
                              }}
                            >
                              Brew this bean
                            </Button>
                            <Button variant="secondary" size="small" onClick={() => startEditBean(bean)}>
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showBeanForm ? (
                  <form className="inline-form" onSubmit={handleSaveBean}>
                    <h2 className="section-heading">{editingBean ? 'Edit bean' : 'Add a bean'}</h2>
                    <FormField label="Bean name">
                      <Input
                        value={beanForm.name}
                        onChange={(e) => updateBeanForm('name', e.target.value)}
                        placeholder="e.g. Finca La Esperanza"
                      />
                    </FormField>
                    <FormField label="Roaster name">
                      <Input
                        value={beanForm.roasterName}
                        onChange={(e) => updateBeanForm('roasterName', e.target.value)}
                        placeholder="e.g. Corvid Coffee"
                      />
                    </FormField>
                    <div className="form-grid">
                      <FormField label="Origin / Region">
                        <Input
                          value={beanForm.origin}
                          onChange={(e) => updateBeanForm('origin', e.target.value)}
                          placeholder="e.g. Huila, Colombia"
                        />
                      </FormField>
                      <FormField label="Roast date">
                        <Input
                          type="date"
                          value={beanForm.roastDate}
                          onChange={(e) => updateBeanForm('roastDate', e.target.value)}
                        />
                      </FormField>
                    </div>
                    <FormField label="Roast level">
                      <Select value={beanForm.roast} onChange={(e) => updateBeanForm('roast', e.target.value)}>
                        <option value="Light roast">Light roast</option>
                        <option value="Medium roast">Medium roast</option>
                        <option value="Medium Dark roast">Medium-Dark roast</option>
                        <option value="Dark roast">Dark roast</option>
                      </Select>
                    </FormField>
                    <div className="form-actions">
                      <Button type="submit" variant="accent">
                        {editingBean ? 'Save changes' : 'Save bean'}
                      </Button>
                      <Button variant="secondary" onClick={cancelBeanForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button variant="secondary" icon={addIcon} onClick={() => setShowBeanForm(true)}>
                    Add bean
                  </Button>
                )}
              </section>
            )}

            {/* Log Brew */}
            {currentPage === 'Log Brew' && (
              <section>
                <h1 className="screen-title">{editingLog ? 'Edit brew' : 'Log a brew'}</h1>
                <p className="screen-subtitle">
                  {editingLog ? 'Update the details for this brew.' : "Write it down while it's still fresh."}
                </p>

                {beans.length === 0 ? (
                  <div className="empty-state">
                    <p>You'll need a bean in your library first.</p>
                    <Button variant="accent" className="mt-4" onClick={() => setCurrentPage('Beans')}>
                      Go add a bean
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveLog}>
                    <h2 className="section-heading">Which bean?</h2>
                    <div className="card-list mb-16">
                      {beans.map((bean) => (
                        <div
                          key={bean.id}
                          className={selectedBeanId === bean.id ? 'brew-card selected' : 'brew-card'}
                          onClick={() => setSelectedBeanId(bean.id)}
                          role="radio"
                          aria-checked={selectedBeanId === bean.id}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setSelectedBeanId(bean.id);
                          }}
                        >
                          <div>
                            <div className="card-title">{bean.name}</div>
                            <div className="card-meta">{bean.roasterName}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h2 className="section-heading">Recipe</h2>
                    <div className="form-grid">
                      <FormField label="Dose (g)">
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          step="0.1"
                          value={logForm.dose}
                          onChange={(e) => updateLogForm('dose', e.target.value)}
                        />
                      </FormField>
                      <FormField label="Yield (g)">
                        <Input
                          type="number"
                          min={1}
                          max={2000}
                          step="0.1"
                          value={logForm.yieldG}
                          onChange={(e) => updateLogForm('yieldG', e.target.value)}
                        />
                      </FormField>
                      <FormField label="Grind size">
                        <Select value={logForm.grind} onChange={(e) => updateLogForm('grind', e.target.value)}>
                          {GRIND_SIZES.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </Select>
                      </FormField>
                      <FormField label="Water temperature (°C)">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={logForm.temp}
                          onChange={(e) => updateLogForm('temp', e.target.value)}
                        />
                      </FormField>
                      <FormField label="Brew time">
                        <Input value={logForm.time} onChange={(e) => updateLogForm('time', e.target.value)} />
                      </FormField>
                    </div>

                    <h2 className="section-heading mt-4">How does it taste?</h2>
                    <FormField label="Overall rating">
                      <StarRating rating={logForm.rating} onRatingChange={(star) => updateLogForm('rating', star)} />
                    </FormField>

                    <div className="cupping-card">
                      <h3 className="cupping-card-title">Cupping profile</h3>
                      <p className="cupping-card-subtitle">Rate the coffee on each scale from 1 to 5.</p>
                      {CUPPING_TRAITS.map((trait) => (
                        <CuppingSlider
                          key={trait.key}
                          label={trait.label}
                          leftLabel={trait.left}
                          rightLabel={trait.right}
                          value={logForm[trait.key]}
                          onChange={(value) => updateLogForm(trait.key, value)}
                        />
                      ))}
                    </div>

                    <FormField label="Flavor notes">
                      <FlavorPicker
                        selected={logForm.flavorTags}
                        onChange={(tags) => updateLogForm('flavorTags', tags)}
                      />
                    </FormField>

                    <FormField label="Tasting notes">
                      <textarea
                        className="input-control"
                        value={logForm.notes}
                        onChange={(e) => updateLogForm('notes', e.target.value)}
                        placeholder="Bright, sweet, silky... jot how it tasted or what you'd change next time."
                      />
                    </FormField>

                    <div className="form-actions">
                      <Button type="submit" variant="accent">
                        {editingLog ? 'Save changes' : 'Save brew log'}
                      </Button>
                      <Button variant="secondary" onClick={cancelLogForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </section>
            )}

            {/* Journal */}
            {currentPage === 'Journal' && (
              <section>
                <h1 className="screen-title">Brew journal</h1>

                {selectedLog ? (
                  <div className="detailed-log-card">
                    <div className="detail-header">
                      <h2 className="screen-title detail-title">{selectedLog.beanName}</h2>
                      <div className="button-row">
                        <Button variant="secondary" size="small" onClick={() => startEditLog(selectedLog)}>
                          Edit
                        </Button>
                        <Button variant="secondary" size="small" onClick={() => setSelectedLogId(null)}>
                          Close
                        </Button>
                      </div>
                    </div>
                    <div className="card-meta">{selectedLog.date}</div>

                    <div className="metric-grid">
                      {metrics.map((metric) => (
                        <div key={metric.label} className="metric-tile">
                          <div className="metric-value">{metric.value}</div>
                          <div className="metric-label">{metric.label}</div>
                        </div>
                      ))}
                    </div>

                    <FormField label="Overall rating">
                      <StarRating rating={selectedLog.rating} readOnly />
                    </FormField>

                    <div className="cupping-card">
                      <h3 className="cupping-card-title">Cupping profile</h3>
                      {CUPPING_TRAITS.map((trait) => (
                        <CuppingBar
                          key={trait.key}
                          label={trait.label}
                          leftLabel={trait.left}
                          rightLabel={trait.right}
                          value={selectedLog[trait.key]}
                        />
                      ))}
                    </div>

                    {selectedLog.flavorTags.length > 0 && (
                      <div className="flavor-selected">
                        {selectedLog.flavorTags.map((path) => (
                          <span key={path} className="flavor-tag-badge">
                            {getFlavorName(path)}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="detail-notes">{selectedLog.notes}</p>

                    <button
                      type="button"
                      className="icon-btn danger delete-log-btn"
                      onClick={() => handleDeleteLog(selectedLog.id)}
                      aria-label="Delete this brew log"
                    >
                      <img src={deleteIcon} alt="" className="icon-img" /> Delete this log
                    </button>
                  </div>
                ) : (
                  <>
                    <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

                    <div className="filter-pills">
                      {ROAST_FILTERS.map((level) => (
                        <button
                          type="button"
                          key={level}
                          className={roastFilter === level ? 'pill active' : 'pill'}
                          onClick={() => setRoastFilter(level)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>

                    <div className="sort-box">
                      <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="date-desc">Newest first</option>
                        <option value="date-asc">Oldest first</option>
                        <option value="rating-desc">Highest rated</option>
                        <option value="rating-asc">Lowest rated</option>
                      </Select>
                    </div>

                    {sortedLogs.length === 0 ? (
                      <div className="empty-state">
                        <p>No brews match this search.</p>
                        <p>Try a different bean, note, or roast filter.</p>
                      </div>
                    ) : (
                      <div className="card-list">
                        {sortedLogs.map((log) => (
                          <BrewLogCard key={log.id} log={log} onClick={() => setSelectedLogId(log.id)} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}