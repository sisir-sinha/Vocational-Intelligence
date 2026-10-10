// Vocational Intelligence - Core Application Logic (Vanilla JS)
(function () {
  'use strict';

  const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const EN_TO_BN_MAP = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
  const BN_TO_EN_MAP = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };

  function toBnNum(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/[0-9]/g, d => EN_TO_BN_MAP[d] || d);
  }

  function toEnNum(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/[০-৯]/g, d => BN_TO_EN_MAP[d] || d);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Trade metadata
  const TRADES_META = {
    'all': {
      id: 'all',
      shortLabel: 'সকল ট্রেড',
      title: 'সকল ট্রেড (IoT Basics 1–4)',
      classLabel: '৯ম ও ১০ম শ্রেণি',
      icon: 'fa-layer-group'
    },
    'trade-1': {
      id: 'trade-1',
      shortLabel: 'ট্রেড-১ (IoT-1)',
      title: 'ট্রেড-১ (IoT Basics-1)',
      classLabel: 'নবম শ্রেণি',
      icon: 'fa-microchip'
    },
    'trade-2': {
      id: 'trade-2',
      shortLabel: 'ট্রেড-২ (IoT-2)',
      title: 'ট্রেড-২ (IoT Basics-2)',
      classLabel: 'নবম শ্রেণি',
      icon: 'fa-network-wired'
    },
    'trade-3': {
      id: 'trade-3',
      shortLabel: 'ট্রেড-৩ (IoT-3)',
      title: 'ট্রেড-৩ (IoT Basics-3)',
      classLabel: 'দশম শ্রেণি',
      icon: 'fa-laptop-medical'
    },
    'trade-4': {
      id: 'trade-4',
      shortLabel: 'ট্রেড-৪ (IoT-4)',
      title: 'ট্রেড-৪ (IoT Basics-4)',
      classLabel: 'দশম শ্রেণি',
      icon: 'fa-robot'
    }
  };

  const TYPE_META = {
    'very_short': {
      label: 'অতি সংক্ষিপ্ত',
      fullLabel: 'অতি সংক্ষিপ্ত প্রশ্নোত্তর',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      numClass: 'bg-emerald-600 text-white',
      icon: 'fa-bolt',
      order: 1
    },
    'short': {
      label: 'সংক্ষিপ্ত',
      fullLabel: 'সংক্ষিপ্ত প্রশ্নোত্তর',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      numClass: 'bg-blue-600 text-white',
      icon: 'fa-align-left',
      order: 2
    },
    'broad': {
      label: 'রচনামূলক',
      fullLabel: 'রচনামূলক প্রশ্নোত্তর',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
      numClass: 'bg-purple-600 text-white',
      icon: 'fa-book-open',
      order: 3
    },
    'practical': {
      label: 'ব্যবহারিক',
      fullLabel: 'ব্যবহারিক (Practical)',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      numClass: 'bg-amber-600 text-white',
      icon: 'fa-screwdriver-wrench',
      order: 4
    }
  };

  function getShortTradeBadge(tid, fallback) {
    if (tid === 'trade-1') return 'ট্রেড-১';
    if (tid === 'trade-2') return 'ট্রেড-২';
    if (tid === 'trade-3') return 'ট্রেড-৩';
    if (tid === 'trade-4') return 'ট্রেড-৪';
    return fallback || tid;
  }

  // Topic Quick Filter definitions
  const TOPIC_FILTERS = [
    { id: 'all', label: 'সকল টপিক', icon: 'fa-border-all', keywords: [] },
    { id: 'পূর্ণরূপ', label: 'পূর্ণরূপ (Full Form)', icon: 'fa-spell-check', keywords: ['পূর্ণরূপ', 'পূর্ণনাম', 'পূর্ণ নাম'] },
    { id: 'পার্থক্য', label: 'পার্থক্য (Difference)', icon: 'fa-scale-balanced', keywords: ['পার্থক্য'] },
    { id: 'চিত্র/ডায়াগ্রাম', label: 'চিত্র ও ফ্লোচার্ট', icon: 'fa-diagram-project', keywords: ['চিত্র', 'অঙ্কন', 'ডায়াগ্রাম', 'ফ্লোচার্ট', 'প্রতীক আঁক'] },
    { id: 'কোডিং/অ্যালগরিদম', label: 'প্রোগ্রাম ও অ্যালগরিদম', icon: 'fa-code', keywords: ['প্রোগ্রাম লেখ', 'প্রোগ্রামটি কর', 'ফাংশন লেখ', 'অ্যালগরিদম'] },
    { id: 'ইলেকট্রিক্যাল ও ইলেকট্রনিক্স', label: 'ইলেকট্রিক্যাল ও ইলেকট্রনিক্স', icon: 'fa-bolt-lightning', keywords: ['ইলেকট্রিসিটি', 'কারেন্ট', 'ভোল্টেজ', 'রেজিস্ট্যান্স', 'রেজিস্টর', 'ক্যাপাসিটর', 'ইন্ডাক্টর', 'ডায়োড', 'মাল্টিমিটার', 'ট্রান্সফর্মার', 'ফিউজ', 'পাওয়ার ফ্যাক্টর', 'ওহম'] },
    { id: 'ইথিকস ও হ্যাজার্ড', label: 'ইথিকস, পিপিই ও হ্যাজার্ড', icon: 'fa-helmet-safety', keywords: ['ইথিকস', 'হ্যাজার্ড', 'পিপিই', 'ppe', 'ঝুঁকি', 'কপিরাইট', 'প্লেজারিজম', 'মেধাস্বত্ব', 'ওএসএইচ'] },
    { id: 'মাদারবোর্ড ও হার্ডওয়্যার', label: 'মাদারবোর্ড, পোর্ট ও হার্ডওয়্যার', icon: 'fa-plug', keywords: ['মাদারবোর্ড', 'motherboard', 'পোর্ট', 'port', 'স্লট', 'র‍্যাম', 'ram', 'সিপিইউ', 'cpu', 'চিপসেট', 'প্রসেসর'] },
    { id: 'সিকিউরিটি ও ম্যালওয়্যার', label: 'সিকিউরিটি ও ভাইরাস', icon: 'fa-shield-halved', keywords: ['সিকিউরিটি', 'নিরাপত্তা', 'ভাইরাস', 'ম্যালওয়্যার', 'ট্রোজান', 'পাসওয়ার্ড', 'সাইবার', 'ফিশিং'] },
    { id: 'ল্যাপটপ সার্ভিসিং', label: 'ল্যাপটপ সার্ভিসিং', icon: 'fa-laptop', keywords: ['ল্যাপটপ', 'থার্মাল', 'ব্যাটারি', 'টাচপ্যাড', 'কুলিং'] },
    { id: 'পাইথন ও প্রোগ্রামিং', label: 'পাইথন ও প্রোগ্রামিং', icon: 'fa-terminal', keywords: ['পাইথন', 'python', 'লিস্ট', 'টাপল', 'ডাটা টাইপ', 'অপারেটর', 'লুপ', 'কম্পাইলার'] },
    { id: 'মাইক্রোকন্ট্রোলার ও আরডুইনো', label: 'মাইক্রোকন্ট্রোলার ও আরডুইনো', icon: 'fa-microchip', keywords: ['মাইক্রোকন্ট্রোলার', 'আরডুইনো', 'arduino', '৮০৫১', '8051', 'এমবেডেড', 'attiny', 'pic16'] },
    { id: 'আইওটি ও সেন্সর', label: 'আইওটি, সেন্সর ও ক্লাউড', icon: 'fa-wifi', keywords: ['আইওটি', 'iot', 'সেন্সর', 'sensor', 'ক্লাউড', 'শিল্পবিপ্লব', 'শিল্প বিপ্লব', 'বিগ ডাটা', 'বিগ-ডাটা'] }
  ];

  // State
  const state = {
    questions: [],
    starredIds: new Set(),
    activeTrade: 'all',
    activeChapter: 'all',
    activePreset: 'all', // 'all', 'top_important', 'all_important', 'board_all', 'board_recent', 'starred'
    activeType: 'all',   // 'all', 'very_short', 'short', 'broad', 'practical'
    activeSource: 'all', // 'all', 'core', 'extra'
    activeBoardYear: 'all', // 'all', 'repeat_2plus', 'non_board', or year string e.g. '2025'
    activeTopic: 'all',
    searchQuery: '',
    searchScope: 'all', // 'all', 'main', 'alt'
    sortBy: 'serial',   // 'serial', 'importance_desc', 'board_count_desc', 'board_year_desc', 'type_asc', 'alt_count_desc', 'chapter_desc'
    viewMode: 'grouped', // 'grouped', 'list', 'compact'
    collapsedGroups: new Set(),
    darkMode: true
  };

  // Load persisted data
  function loadStateFromStorage() {
    try {
      const savedStarred = localStorage.getItem('vi_starred_ids');
      if (savedStarred) {
        const arr = JSON.parse(savedStarred);
        if (Array.isArray(arr)) state.starredIds = new Set(arr);
      }
      const savedCustomQs = localStorage.getItem('vi_custom_questions');
      let customQs = [];
      if (savedCustomQs) {
        const parsed = JSON.parse(savedCustomQs);
        if (Array.isArray(parsed)) customQs = parsed;
      }
      state.questions = [...(window.INITIAL_QUESTIONS_DATA || []), ...customQs];

      const savedTheme = localStorage.getItem('vi_dark_mode');
      if (savedTheme === 'false') {
        state.darkMode = false;
        document.documentElement.classList.remove('dark');
      } else {
        state.darkMode = true;
        document.documentElement.classList.add('dark');
      }

      // Restore active filters, search, sort & view mode from localStorage
      const savedFiltersRaw = localStorage.getItem('vi_active_filters_v1');
      if (savedFiltersRaw) {
        const sf = JSON.parse(savedFiltersRaw);
        if (sf && typeof sf === 'object') {
          if (typeof sf.activeTrade === 'string' && TRADES_META[sf.activeTrade]) state.activeTrade = sf.activeTrade;
          if (typeof sf.activeChapter === 'string') state.activeChapter = sf.activeChapter;
          if (typeof sf.activePreset === 'string') state.activePreset = sf.activePreset;
          if (typeof sf.activeType === 'string') state.activeType = sf.activeType;
          if (typeof sf.activeSource === 'string') state.activeSource = sf.activeSource;
          if (sf.activeBoardYear !== undefined && sf.activeBoardYear !== null) state.activeBoardYear = String(sf.activeBoardYear);
          if (typeof sf.activeTopic === 'string') state.activeTopic = sf.activeTopic;
          if (typeof sf.searchQuery === 'string') state.searchQuery = sf.searchQuery;
          if (typeof sf.searchScope === 'string') state.searchScope = sf.searchScope;
          if (typeof sf.sortBy === 'string') state.sortBy = sf.sortBy;
          if (typeof sf.viewMode === 'string') state.viewMode = sf.viewMode;
          if (Array.isArray(sf.collapsedGroups)) state.collapsedGroups = new Set(sf.collapsedGroups);
        }
      }
    } catch (err) {
      console.error('Storage load error:', err);
      state.questions = [...(window.INITIAL_QUESTIONS_DATA || [])];
      document.documentElement.classList.add('dark');
    }
  }

  function saveFiltersToStorage() {
    try {
      localStorage.setItem('vi_active_filters_v1', JSON.stringify({
        activeTrade: state.activeTrade,
        activeChapter: state.activeChapter,
        activePreset: state.activePreset,
        activeType: state.activeType,
        activeSource: state.activeSource,
        activeBoardYear: state.activeBoardYear,
        activeTopic: state.activeTopic,
        searchQuery: state.searchQuery,
        searchScope: state.searchScope,
        sortBy: state.sortBy,
        viewMode: state.viewMode,
        collapsedGroups: Array.from(state.collapsedGroups)
      }));
    } catch (e) {
      console.error('Filter save error:', e);
    }
  }

  function saveStarredToStorage() {
    try {
      localStorage.setItem('vi_starred_ids', JSON.stringify(Array.from(state.starredIds)));
    } catch (e) {
      console.error(e);
    }
  }

  // Format board years array like [2019, 2024, 2025] -> "বাকাশিবো-২০১৯, ২৪, ২৫"
  function formatBoardYearsText(years) {
    if (!years || !years.length) return '';
    const sorted = [...years].sort((a, b) => a - b);
    const parts = sorted.map((y, idx) => {
      if (idx === 0) return toBnNum(y);
      return toBnNum(String(y).slice(-2));
    });
    return `বাকাশিবো-${parts.join(', ')}`;
  }

  // Expand search terms using bilingual synonyms & digit normalization
  function getExpandedSearchTerms(rawQuery) {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    const synMap = window.BILINGUAL_SYNONYMS || {};

    // Also check full phrase in synonym map
    const phraseSyns = synMap[q] ? [...synMap[q], q] : null;
    if (phraseSyns) {
      return [phraseSyns.map(s => s.toLowerCase())];
    }

    return tokens.map(token => {
      const variants = new Set([token]);
      // Add digit conversions
      const enToken = toEnNum(token);
      const bnToken = toBnNum(token);
      variants.add(enToken);
      variants.add(bnToken);
      if (synMap[token]) {
        synMap[token].forEach(s => variants.add(s.toLowerCase()));
      }
      if (synMap[enToken]) {
        synMap[enToken].forEach(s => variants.add(s.toLowerCase()));
      }
      return Array.from(variants);
    });
  }

  // Check if a question matches search query
  function matchesSearch(q, expandedTokenGroups) {
    if (!expandedTokenGroups.length) return true;

    let targetText = '';
    if (state.searchScope === 'main') {
      targetText = `${q.question} ${q.q_no_bn} ${formatBoardYearsText(q.main_years)}`;
    } else if (state.searchScope === 'alt') {
      if (!q.alternatives || !q.alternatives.length) return false;
      targetText = q.alternatives.map(a => `${a.text} ${formatBoardYearsText(a.years)}`).join(' ');
    } else {
      const altStr = (q.alternatives || []).map(a => `${a.text} ${formatBoardYearsText(a.years)}`).join(' ');
      const yearsStr = (q.board_years || []).map(y => `${y} ${toBnNum(y)}`).join(' ');
      targetText = `${q.question} ${altStr} ${q.chapter} ${q.section} ${yearsStr} ${(q.topic_tags || []).join(' ')}`;
    }

    const lowerTarget = targetText.toLowerCase();
    return expandedTokenGroups.every(variantGroup =>
      variantGroup.some(variant => lowerTarget.includes(variant))
    );
  }

  // Highlight matching search terms in displayed text
  function highlightText(text, expandedTokenGroups) {
    const safe = escapeHtml(text);
    if (!expandedTokenGroups || !expandedTokenGroups.length) return safe;

    // Collect all flat terms >= 2 chars
    const allTerms = [];
    expandedTokenGroups.forEach(group => {
      group.forEach(term => {
        if (term && term.length >= 1) {
          allTerms.push(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        }
      });
    });
    if (!allTerms.length) return safe;

    // Sort longest first to avoid partial nested replacements
    allTerms.sort((a, b) => b.length - a.length);
    const regex = new RegExp(`(${allTerms.join('|')})`, 'gi');
    return safe.replace(regex, '<mark class="vi-highlight">$1</mark>');
  }

  // Filter questions based on all active filters
  function getFilteredQuestions(options = {}) {
    const ignoreChapter = options.ignoreChapter || false;
    const ignorePreset = options.ignorePreset || false;
    const expandedSearch = getExpandedSearchTerms(state.searchQuery);
    const activeTopicObj = TOPIC_FILTERS.find(t => t.id === state.activeTopic);

    const filtered = state.questions.filter(q => {
      // 1. Trade filter
      if (state.activeTrade !== 'all' && q.trade_id !== state.activeTrade) {
        return false;
      }

      // 2. Chapter filter
      if (!ignoreChapter && state.activeChapter !== 'all') {
        const chKey = `${q.trade_id}::${q.chapter}`;
        if (chKey !== state.activeChapter && q.chapter !== state.activeChapter) {
          return false;
        }
      }

      // 3. Preset filter
      if (!ignorePreset && state.activePreset !== 'all') {
        const isStarred = state.starredIds.has(q.id);
        if (state.activePreset === 'top_important') {
          if (q.importance_tier !== 'top' && !isStarred) return false;
        } else if (state.activePreset === 'all_important') {
          if (q.importance_tier === 'standard' && !isStarred) return false;
        } else if (state.activePreset === 'board_all') {
          if (!q.board_years || q.board_years.length === 0) return false;
        } else if (state.activePreset === 'board_recent') {
          if (!q.board_years || (!q.board_years.includes(2026) && !q.board_years.includes(2025) && !q.board_years.includes(2024))) return false;
        } else if (state.activePreset === 'starred') {
          if (!isStarred) return false;
        }
      }

      // 4. Question Base Type filter
      if (state.activeType !== 'all' && q.base_type !== state.activeType) {
        return false;
      }

      // 5. Source filter (Core vs Extra)
      if (state.activeSource === 'core' && q.is_extra) {
        return false;
      }
      if (state.activeSource === 'extra' && !q.is_extra) {
        return false;
      }

      // 6. Board Year filter
      if (state.activeBoardYear !== 'all') {
        const yrs = q.board_years || [];
        if (state.activeBoardYear === 'repeat_2plus') {
          if (yrs.length < 2 && (q.board_count || 0) < 2) return false;
        } else if (state.activeBoardYear === 'non_board') {
          if (yrs.length > 0) return false;
        } else {
          const yrNum = parseInt(state.activeBoardYear, 10);
          if (!yrs.includes(yrNum)) return false;
        }
      }

      // 7. Topic chip filter
      if (state.activeTopic !== 'all' && activeTopicObj) {
        const tags = q.topic_tags || [];
        if (tags.includes(state.activeTopic)) {
          // matched direct topic tag
        } else {
          const fullTxt = `${q.question} ${(q.alternatives || []).map(a => a.text).join(' ')}`.toLowerCase();
          const hasKw = activeTopicObj.keywords.some(kw => fullTxt.includes(kw.toLowerCase()));
          if (!hasKw) return false;
        }
      }

      // 8. Search query
      if (!matchesSearch(q, expandedSearch)) {
        return false;
      }

      return true;
    });

    // Sort filtered questions
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (state.sortBy === 'importance_desc') {
        const starA = state.starredIds.has(a.id) ? 1000 : 0;
        const starB = state.starredIds.has(b.id) ? 1000 : 0;
        const diff = (b.importance_score + starB) - (a.importance_score + starA);
        if (diff !== 0) return diff;
      } else if (state.sortBy === 'board_count_desc') {
        const cntA = (a.board_years ? a.board_years.length : 0) * 10 + (a.board_count || 0);
        const cntB = (b.board_years ? b.board_years.length : 0) * 10 + (b.board_count || 0);
        if (cntB !== cntA) return cntB - cntA;
      } else if (state.sortBy === 'board_year_desc') {
        const maxA = a.board_years && a.board_years.length ? Math.max(...a.board_years) : 0;
        const maxB = b.board_years && b.board_years.length ? Math.max(...b.board_years) : 0;
        if (maxB !== maxA) return maxB - maxA;
        if ((b.board_years?.length || 0) !== (a.board_years?.length || 0)) {
          return (b.board_years?.length || 0) - (a.board_years?.length || 0);
        }
      } else if (state.sortBy === 'type_asc') {
        const ordA = TYPE_META[a.base_type]?.order || 99;
        const ordB = TYPE_META[b.base_type]?.order || 99;
        if (ordA !== ordB) return ordA - ordB;
        if (a.is_extra !== b.is_extra) return a.is_extra ? 1 : -1;
      } else if (state.sortBy === 'alt_count_desc') {
        const altA = a.alternatives ? a.alternatives.length : 0;
        const altB = b.alternatives ? b.alternatives.length : 0;
        if (altB !== altA) return altB - altA;
      } else if (state.sortBy === 'chapter_desc') {
        if (a.trade_id !== b.trade_id) return b.trade_id.localeCompare(a.trade_id);
        if (b.chapter_num !== a.chapter_num) return b.chapter_num - a.chapter_num;
      }

      // Default serial fallback
      if (a.trade_id !== b.trade_id) return a.trade_id.localeCompare(b.trade_id);
      if (a.chapter_num !== b.chapter_num) return a.chapter_num - b.chapter_num;
      if (a.trade_id === 'trade-1') {
        return a.q_no - b.q_no;
      }
      const ordA = TYPE_META[a.base_type]?.order || 99;
      const ordB = TYPE_META[b.base_type]?.order || 99;
      if (ordA !== ordB) return ordA - ordB;
      if (a.is_extra !== b.is_extra) return a.is_extra ? 1 : -1;
      return a.q_no - b.q_no;
    });

    return sorted;
  }

  // Render Top KPI Statistics & Trade Tabs
  function renderHeaderAndTrades() {
    const allQs = state.questions;
    const totalCount = allQs.length;
    const boardCount = allQs.filter(q => q.board_years && q.board_years.length > 0).length;
    const topImpCount = allQs.filter(q => q.importance_tier === 'top').length;
    const starredCount = state.starredIds.size;

    const elTotal = document.getElementById('kpi-total');
    const elBoard = document.getElementById('kpi-board');
    const elTopImp = document.getElementById('kpi-top-important');
    const elStarred = document.getElementById('kpi-starred');

    if (elTotal) elTotal.textContent = toBnNum(totalCount);
    if (elBoard) elBoard.textContent = toBnNum(boardCount);
    if (elTopImp) elTopImp.textContent = toBnNum(topImpCount);
    if (elStarred) elStarred.textContent = toBnNum(starredCount);

    // Trade counts
    const tradeCounts = { 'all': totalCount, 'trade-1': 0, 'trade-2': 0, 'trade-3': 0, 'trade-4': 0 };
    allQs.forEach(q => {
      if (tradeCounts[q.trade_id] !== undefined) tradeCounts[q.trade_id]++;
    });

    const tradeTabsContainer = document.getElementById('trade-tabs-container');
    if (tradeTabsContainer) {
      tradeTabsContainer.innerHTML = Object.keys(TRADES_META).map(tid => {
        const meta = TRADES_META[tid];
        const count = tradeCounts[tid] || 0;
        const isActive = state.activeTrade === tid;
        const isPending = (tid === 'trade-1' || tid === 'trade-2') && count === 0;

        return `
          <button
            type="button"
            data-trade="${tid}"
            class="trade-tab-btn group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 whitespace-nowrap border ${
              isActive
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50/40 dark:hover:bg-slate-800'
            }"
          >
            <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/80'
            }">
              <i class="fa-solid ${meta.icon}"></i>
            </span>
            <div class="text-left">
              <div class="font-semibold leading-tight flex items-center gap-1.5">
                <span>${meta.shortLabel}</span>
                ${
                  isPending
                    ? `<span class="text-[10px] px-1.5 py-0.5 rounded-full font-normal ${
                        isActive ? 'bg-amber-400/30 text-amber-100' : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                      }">সংযোজনযোগ্য</span>`
                    : `<span class="text-xs px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                      }">${toBnNum(count)}</span>`
                }
              </div>
              <div class="text-[11px] ${isActive ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-400'}">${meta.classLabel}</div>
            </div>
          </button>
        `;
      }).join('');

      tradeTabsContainer.querySelectorAll('.trade-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedTrade = btn.getAttribute('data-trade');
          state.activeTrade = selectedTrade;
          state.activeChapter = 'all';
          renderAll();
        });
      });
    }
  }

  // Render Preset Pills (সকল, অতি গুরুত্বপূর্ণ, গুরুত্বপূর্ণ, বোর্ড প্রশ্ন, সাম্প্রতিক বোর্ড, তারকাচিহ্নিত)
  function renderPresetBar() {
    const basePool = state.questions.filter(q => state.activeTrade === 'all' || q.trade_id === state.activeTrade);
    const counts = {
      all: basePool.length,
      top_important: basePool.filter(q => q.importance_tier === 'top' || state.starredIds.has(q.id)).length,
      all_important: basePool.filter(q => q.importance_tier !== 'standard' || state.starredIds.has(q.id)).length,
      board_all: basePool.filter(q => q.board_years && q.board_years.length > 0).length,
      board_recent: basePool.filter(q => q.board_years && (q.board_years.includes(2026) || q.board_years.includes(2025) || q.board_years.includes(2024))).length,
      starred: basePool.filter(q => state.starredIds.has(q.id)).length
    };

    const presets = [
      { id: 'all', label: 'সকল প্রশ্ন', icon: 'fa-list-check', count: counts.all, color: 'indigo' },
      { id: 'top_important', label: 'অতি গুরুত্বপূর্ণ (★★★)', icon: 'fa-fire', count: counts.top_important, color: 'rose' },
      { id: 'all_important', label: 'গুরুত্বপূর্ণ সাজেশন', icon: 'fa-wand-magic-sparkles', count: counts.all_important, color: 'amber' },
      { id: 'board_all', label: 'সকল বোর্ড প্রশ্ন [বাকাশিবো]', icon: 'fa-building-columns', count: counts.board_all, color: 'emerald' },
      { id: 'board_recent', label: 'বোর্ড ২০২৪–২০২৬', icon: 'fa-calendar-check', count: counts.board_recent, color: 'cyan' },
      { id: 'starred', label: 'আমার তারকাচিহ্নিত (★)', icon: 'fa-star', count: counts.starred, color: 'yellow' }
    ];

    const container = document.getElementById('preset-pills-container');
    if (!container) return;

    container.innerHTML = presets.map(p => {
      const active = state.activePreset === p.id;
      return `
        <button
          type="button"
          data-preset="${p.id}"
          class="preset-pill-btn inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border whitespace-nowrap ${
            active
              ? 'bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-500 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/70'
          }"
        >
          <i class="fa-solid ${p.icon} ${
            active
              ? 'text-amber-300'
              : p.id === 'top_important'
              ? 'text-rose-500'
              : p.id === 'board_all'
              ? 'text-emerald-600 dark:text-emerald-400'
              : p.id === 'starred'
              ? 'text-amber-500'
              : 'text-indigo-500'
          }"></i>
          <span>${p.label}</span>
          <span class="px-1.5 py-0.5 text-[11px] rounded-full ${
            active
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          }">${toBnNum(p.count)}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.preset-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activePreset = btn.getAttribute('data-preset');
        renderAll();
      });
    });
  }

  // Render Topic Chips Bar
  function renderTopicChips() {
    const container = document.getElementById('topic-chips-container');
    if (!container) return;

    container.innerHTML = TOPIC_FILTERS.map(t => {
      const active = state.activeTopic === t.id;
      return `
        <button
          type="button"
          data-topic="${t.id}"
          class="topic-chip-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
            active
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400'
          }"
        >
          <i class="fa-solid ${t.icon} text-[11px] ${active ? 'text-white' : 'text-slate-400'}"></i>
          <span>${t.label}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.topic-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeTopic = btn.getAttribute('data-topic');
        renderAll();
      });
    });
  }

  // Render Sidebar Chapters & Mobile Chapter Selector
  function renderChapterNavigation() {
    const baseQuestions = getFilteredQuestions({ ignoreChapter: true });
    const allTradePool = state.questions.filter(q => state.activeTrade === 'all' || q.trade_id === state.activeTrade);

    // Group chapters by trade
    const chapterMap = new Map();
    allTradePool.forEach(q => {
      const key = `${q.trade_id}::${q.chapter}`;
      if (!chapterMap.has(key)) {
        chapterMap.set(key, {
          key,
          trade_id: q.trade_id,
          trade_name: q.trade_name,
          chapter: q.chapter,
          chapter_num: q.chapter_num,
          total: 0,
          matching: 0,
          board: 0,
          topImp: 0
        });
      }
      const entry = chapterMap.get(key);
      entry.total++;
      if (q.board_years && q.board_years.length > 0) entry.board++;
      if (q.importance_tier === 'top') entry.topImp++;
    });

    baseQuestions.forEach(q => {
      const key = `${q.trade_id}::${q.chapter}`;
      if (chapterMap.has(key)) {
        chapterMap.get(key).matching++;
      }
    });

    const chaptersList = Array.from(chapterMap.values()).sort((a, b) => {
      if (a.trade_id !== b.trade_id) return a.trade_id.localeCompare(b.trade_id);
      return a.chapter_num - b.chapter_num;
    });

    // Desktop Sidebar
    const sidebarEl = document.getElementById('chapter-sidebar-list');
    if (sidebarEl) {
      let html = `
        <button
          type="button"
          data-chapter-key="all"
          class="chapter-nav-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all mb-1.5 border ${
            state.activeChapter === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:bg-indigo-50/50 dark:hover:bg-slate-700/60'
          }"
        >
          <span class="flex items-center gap-2 truncate">
            <i class="fa-solid fa-layer-group ${state.activeChapter === 'all' ? 'text-white' : 'text-indigo-500'}"></i>
            <span class="truncate">সকল অধ্যায় একত্রে</span>
          </span>
          <span class="px-2 py-0.5 text-xs rounded-full font-bold ${
            state.activeChapter === 'all'
              ? 'bg-white/20 text-white'
              : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
          }">${toBnNum(baseQuestions.length)}</span>
        </button>
      `;

      let lastTrade = null;
      chaptersList.forEach(ch => {
        if (state.activeTrade === 'all' && ch.trade_id !== lastTrade) {
          lastTrade = ch.trade_id;
          html += `
            <div class="pt-3 pb-1 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
              <i class="fa-solid fa-folder-tree text-indigo-400"></i>
              <span>${escapeHtml(ch.trade_name)}</span>
            </div>
          `;
        }
        const isActive = state.activeChapter === ch.key;
        html += `
          <button
            type="button"
            data-chapter-key="${escapeHtml(ch.key)}"
            class="chapter-nav-btn w-full group flex flex-col gap-1 p-2.5 rounded-xl text-left transition-all mb-1 border ${
              isActive
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 border-indigo-400 dark:border-indigo-500 shadow-sm'
                : 'bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }"
          >
            <div class="flex items-start justify-between gap-2">
              <span class="text-sm font-semibold leading-snug ${isActive ? 'text-indigo-700 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-200'}">
                ${escapeHtml(ch.chapter)}
              </span>
              <span class="shrink-0 px-2 py-0.5 text-xs rounded-md font-bold ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }">${toBnNum(ch.matching)}</span>
            </div>
            <div class="flex items-center gap-2.5 text-xs text-slate-400 dark:text-slate-400">
              <span title="মোট প্রশ্ন"><i class="fa-regular fa-file-lines mr-0.5"></i>মোট ${toBnNum(ch.total)}</span>
              ${
                ch.board > 0
                  ? `<span class="text-emerald-600 dark:text-emerald-400 font-medium" title="বোর্ড প্রশ্ন"><i class="fa-solid fa-award mr-0.5"></i>বোর্ড ${toBnNum(ch.board)}</span>`
                  : ''
              }
              ${
                ch.topImp > 0
                  ? `<span class="text-rose-500 dark:text-rose-400 font-medium" title="অতি গুরুত্বপূর্ণ"><i class="fa-solid fa-fire mr-0.5"></i>★★★ ${toBnNum(ch.topImp)}</span>`
                  : ''
              }
            </div>
          </button>
        `;
      });

      sidebarEl.innerHTML = html;
      sidebarEl.querySelectorAll('.chapter-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.activeChapter = btn.getAttribute('data-chapter-key');
          renderAll();
        });
      });
    }

    // Mobile Chapter Select Dropdown
    const mobileChapterSelect = document.getElementById('mobile-chapter-select');
    if (mobileChapterSelect) {
      let opts = `<option value="all">সকল অধ্যায় (${toBnNum(baseQuestions.length)}টি প্রশ্ন)</option>`;
      chaptersList.forEach(ch => {
        const prefix = state.activeTrade === 'all' ? `[${getShortTradeBadge(ch.trade_id, ch.trade_name)}] ` : '';
        opts += `<option value="${escapeHtml(ch.key)}" ${state.activeChapter === ch.key ? 'selected' : ''}>${escapeHtml(prefix + ch.chapter)} (${toBnNum(ch.matching)})</option>`;
      });
      mobileChapterSelect.innerHTML = opts;
    }
  }

  // Render Board Year Select Options dynamically
  function renderBoardYearDropdown() {
    const selectEl = document.getElementById('filter-board-year');
    if (!selectEl) return;

    const basePool = state.questions.filter(q => state.activeTrade === 'all' || q.trade_id === state.activeTrade);
    const yearCounts = {};
    basePool.forEach(q => {
      (q.board_years || []).forEach(y => {
        yearCounts[y] = (yearCounts[y] || 0) + 1;
      });
    });

    const yearsDesc = Object.keys(yearCounts).map(Number).sort((a, b) => b - a);
    const repeatCount = basePool.filter(q => (q.board_years && q.board_years.length >= 2) || (q.board_count || 0) >= 2).length;
    const nonBoardCount = basePool.filter(q => !q.board_years || q.board_years.length === 0).length;

    let html = `
      <option value="all" ${state.activeBoardYear === 'all' ? 'selected' : ''}>সকল সাল (All Years)</option>
      <option value="repeat_2plus" ${state.activeBoardYear === 'repeat_2plus' ? 'selected' : ''}>🔥 ২+ বার বোর্ডে আসা (${toBnNum(repeatCount)}টি)</option>
    `;
    yearsDesc.forEach(y => {
      html += `<option value="${y}" ${String(state.activeBoardYear) === String(y) ? 'selected' : ''}>বাকাশিবো-${toBnNum(y)} (${toBnNum(yearCounts[y])}টি প্রশ্ন)</option>`;
    });
    html += `<option value="non_board" ${state.activeBoardYear === 'non_board' ? 'selected' : ''}>বোর্ডে আসেনি - অনুশীলন (${toBnNum(nonBoardCount)}টি)</option>`;

    selectEl.innerHTML = html;
  }

  // Render Active Filter Summary Bar
  function renderActiveFilterChips(filteredQuestions) {
    const countEl = document.getElementById('results-count-badge');
    if (countEl) {
      countEl.textContent = `${toBnNum(filteredQuestions.length)}টি প্রশ্ন পাওয়া গেছে`;
    }

    const activeFiltersBar = document.getElementById('active-filters-bar');
    if (!activeFiltersBar) return;

    const chips = [];
    if (state.activeTrade !== 'all') {
      chips.push({ label: TRADES_META[state.activeTrade]?.title || state.activeTrade, clear: () => { state.activeTrade = 'all'; state.activeChapter = 'all'; } });
    }
    if (state.activeChapter !== 'all') {
      const chName = state.activeChapter.includes('::') ? state.activeChapter.split('::')[1] : state.activeChapter;
      chips.push({ label: chName, clear: () => { state.activeChapter = 'all'; } });
    }
    if (state.activePreset !== 'all') {
      const map = {
        top_important: 'অতি গুরুত্বপূর্ণ (★★★)',
        all_important: 'গুরুত্বপূর্ণ সাজেশন',
        board_all: 'সকল বোর্ড প্রশ্ন',
        board_recent: 'বোর্ড ২০২৪–২০২৬',
        starred: 'আমার তারকাচিহ্নিত'
      };
      chips.push({ label: map[state.activePreset] || state.activePreset, clear: () => { state.activePreset = 'all'; } });
    }
    if (state.activeType !== 'all') {
      chips.push({ label: TYPE_META[state.activeType]?.fullLabel || state.activeType, clear: () => { state.activeType = 'all'; } });
    }
    if (state.activeSource !== 'all') {
      chips.push({ label: state.activeSource === 'core' ? 'শুধু মূল প্রশ্ন' : 'শুধু অতিরিক্ত প্রশ্ন', clear: () => { state.activeSource = 'all'; } });
    }
    if (state.activeBoardYear !== 'all') {
      const lbl = state.activeBoardYear === 'repeat_2plus'
        ? '২+ বার বোর্ডে আসা'
        : state.activeBoardYear === 'non_board'
        ? 'বোর্ডে আসেনি'
        : `বাকাশিবো-${toBnNum(state.activeBoardYear)}`;
      chips.push({ label: lbl, clear: () => { state.activeBoardYear = 'all'; } });
    }
    if (state.activeTopic !== 'all') {
      const tObj = TOPIC_FILTERS.find(t => t.id === state.activeTopic);
      chips.push({ label: `টপিক: ${tObj ? tObj.label : state.activeTopic}`, clear: () => { state.activeTopic = 'all'; } });
    }
    if (state.searchQuery.trim()) {
      chips.push({ label: `সার্চ: "${state.searchQuery.trim()}"`, clear: () => {
        state.searchQuery = '';
        const inp = document.getElementById('main-search-input');
        if (inp) inp.value = '';
      } });
    }

    if (chips.length === 0) {
      activeFiltersBar.classList.add('hidden');
      activeFiltersBar.innerHTML = '';
      return;
    }

    activeFiltersBar.classList.remove('hidden');
    activeFiltersBar.innerHTML = `
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1"><i class="fa-solid fa-filter text-indigo-500 mr-1"></i>সক্রিয় ফিল্টার:</span>
        ${chips.map((c, idx) => `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
            <span>${escapeHtml(c.label)}</span>
            <button type="button" data-chip-idx="${idx}" class="clear-single-chip hover:text-rose-600 transition-colors" title="মুছুন">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </span>
        `).join('')}
        <button type="button" id="reset-all-filters-btn" class="ml-auto text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 px-2 py-1">
          <i class="fa-solid fa-rotate-left"></i> সকল ফিল্টার রিসেট করুন
        </button>
      </div>
    `;

    activeFiltersBar.querySelectorAll('.clear-single-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-chip-idx'), 10);
        if (chips[idx]) {
          chips[idx].clear();
          syncControlInputs();
          renderAll();
        }
      });
    });

    const resetBtn = document.getElementById('reset-all-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetAllFilters);
    }
  }

  function resetAllFilters() {
    state.activeTrade = 'all';
    state.activeChapter = 'all';
    state.activePreset = 'all';
    state.activeType = 'all';
    state.activeSource = 'all';
    state.activeBoardYear = 'all';
    state.activeTopic = 'all';
    state.searchQuery = '';
    state.searchScope = 'all';
    state.sortBy = 'serial';
    syncControlInputs();
    renderAll();
  }

  function syncControlInputs() {
    const searchInput = document.getElementById('main-search-input');
    if (searchInput && searchInput.value !== state.searchQuery) {
      searchInput.value = state.searchQuery;
    }
    const clearSearchBtn = document.getElementById('clear-search-btn');
    if (clearSearchBtn) {
      clearSearchBtn.classList.toggle('hidden', !state.searchQuery.trim());
    }
    const typeSelect = document.getElementById('filter-question-type');
    if (typeSelect) typeSelect.value = state.activeType;

    const sourceSelect = document.getElementById('filter-question-source');
    if (sourceSelect) sourceSelect.value = state.activeSource;

    const yearSelect = document.getElementById('filter-board-year');
    if (yearSelect) yearSelect.value = state.activeBoardYear;

    const sortSelect = document.getElementById('sort-by-select');
    if (sortSelect) sortSelect.value = state.sortBy;

    const sidebarSortSelect = document.getElementById('sidebar-sort-select');
    if (sidebarSortSelect) sidebarSortSelect.value = state.sortBy;

    const scopeSelect = document.getElementById('search-scope-select');
    if (scopeSelect) scopeSelect.value = state.searchScope;

    document.querySelectorAll('.view-mode-btn').forEach(btn => {
      const m = btn.getAttribute('data-view');
      const isAct = m === state.viewMode;
      btn.className = `view-mode-btn px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
        isAct
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700'
      }`;
    });
  }

  // Render a single question card
  function renderQuestionCard(q, expandedSearch, isCompact = false) {
    const typeMeta = TYPE_META[q.base_type] || TYPE_META['very_short'];
    const isStarred = state.starredIds.has(q.id);
    const hasBoard = q.board_years && q.board_years.length > 0;
    const isTop = q.importance_tier === 'top';
    const isImp = q.importance_tier === 'important';

    const mainHighlighted = highlightText(q.question, expandedSearch);
    const mainYearsTag = q.main_years && q.main_years.length > 0
      ? `<span class="inline-flex items-center gap-1 ml-1.5 px-2.5 py-0.5 rounded-md text-xs sm:text-[13px] font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">[${formatBoardYearsText(q.main_years)}]</span>`
      : '';

    if (isCompact) {
      return `
        <div class="vi-question-card group bg-white dark:bg-slate-800/90 rounded-xl border ${
          isTop
            ? 'border-rose-200/90 dark:border-rose-900/60'
            : hasBoard
            ? 'border-emerald-200/80 dark:border-emerald-900/50'
            : 'border-slate-200/80 dark:border-slate-700/80'
        } px-4 py-3 hover:shadow-sm transition-all flex items-start justify-between gap-3">
          <div class="flex items-start gap-3 min-w-0 flex-1">
            <span class="shrink-0 px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-bold ${typeMeta.numClass} mt-0.5">${escapeHtml(q.q_no_bn)}।</span>
            <div class="min-w-0 flex-1">
              <div class="text-base sm:text-[18px] font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                ${mainHighlighted} ${mainYearsTag}
              </div>
              ${
                q.alternatives && q.alternatives.length > 0
                  ? `<div class="mt-1.5 space-y-1 pl-2.5 border-l-2 border-indigo-200 dark:border-indigo-800">
                      ${q.alternatives.map(alt => `
                        <div class="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                          <span class="font-bold text-indigo-600 dark:text-indigo-400">অথবা,</span>
                          ${highlightText(alt.text, expandedSearch)}
                          ${alt.years && alt.years.length ? `<span class="text-xs sm:text-[13px] font-semibold text-emerald-700 dark:text-emerald-400 ml-1">[${formatBoardYearsText(alt.years)}]</span>` : ''}
                        </div>
                      `).join('')}
                    </div>`
                  : ''
              }
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            ${
              isTop
                ? `<span class="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800">★★★</span>`
                : ''
            }
            <button
              type="button"
              data-star-id="${q.id}"
              class="star-toggle-btn w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isStarred
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                  : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }"
              title="${isStarred ? 'তারকাচিহ্ন সরান' : 'গুরুত্বপূর্ণ হিসেবে তারকাচিহ্নিত করুন'}"
            >
              <i class="fa-solid fa-star text-xs"></i>
            </button>
            <button
              type="button"
              data-copy-id="${q.id}"
              class="copy-q-btn w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="প্রশ্নটি কপি করুন"
            >
              <i class="fa-regular fa-copy text-xs"></i>
            </button>
          </div>
        </div>
      `;
    }

    // Standard Rich Question Card
    return `
      <article class="vi-question-card group relative bg-white dark:bg-slate-800/95 rounded-2xl border ${
        isTop
          ? 'border-rose-200/90 dark:border-rose-800/70 shadow-sm'
          : hasBoard
          ? 'border-emerald-200/90 dark:border-emerald-800/60 shadow-sm'
          : 'border-slate-200/90 dark:border-slate-700/80'
      } p-4 sm:p-5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/60 transition-all duration-150">
        <!-- Top Meta Row -->
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div class="flex flex-wrap items-center gap-1.5">
            <!-- Serial Number -->
            <span class="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold ${typeMeta.numClass} shadow-xs">
              প্রশ্ন ${escapeHtml(q.q_no_bn)}
            </span>
            <!-- Trade & Chapter Badge -->
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs sm:text-[13px] font-semibold bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300">
              <i class="fa-solid fa-book-bookmark text-indigo-500 text-[11px]"></i>
              <span>${escapeHtml(getShortTradeBadge(q.trade_id, q.trade_name))} • ${escapeHtml(q.chapter.split(':')[0])}</span>
            </span>
            <!-- Section / Type Badge -->
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs sm:text-[13px] font-semibold border ${typeMeta.badgeClass}">
              <i class="fa-solid ${typeMeta.icon} text-[11px]"></i>
              <span>${escapeHtml(q.section)}</span>
            </span>
            <!-- Importance Badge -->
            ${
              isTop
                ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs sm:text-[13px] font-bold bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    <i class="fa-solid fa-fire text-rose-500"></i> অতি গুরুত্বপূর্ণ ★★★
                  </span>`
                : isImp
                ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs sm:text-[13px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/70">
                    <i class="fa-solid fa-star-half-stroke text-amber-500"></i> গুরুত্বপূর্ণ
                  </span>`
                : ''
            }
            ${
              (q.topic_tags || []).map(tag => `
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60">
                  #${escapeHtml(tag)}
                </span>
              `).join('')
            }
          </div>

          <!-- Right Actions: Board Year Pills + Star + Copy -->
          <div class="flex items-center gap-1.5 ml-auto">
            ${
              hasBoard
                ? `<div class="flex flex-wrap items-center gap-1 mr-1">
                    ${q.board_years.map(yr => `
                      <button
                        type="button"
                        data-year-pill="${yr}"
                        class="board-year-pill px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                        title="বাকাশিবো-${toBnNum(yr)} সালের সকল প্রশ্ন দেখুন"
                      >
                        বাকাশিবো ’${toBnNum(String(yr).slice(-2))}
                      </button>
                    `).join('')}
                  </div>`
                : ''
            }
            <button
              type="button"
              data-qb-quick-add="${q.id}"
              class="qb-quick-add-btn w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
                isInQuestionPaper(q.id)
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 text-slate-400 hover:text-amber-500 hover:border-amber-400'
              }"
              title="${isInQuestionPaper(q.id) ? 'প্রশ্নপত্রে যুক্ত আছে (সরাতে ক্লিক করুন)' : 'প্রশ্নপত্রে যোগ করুন (Make Question)'}"
            >
              <i class="fa-solid ${isInQuestionPaper(q.id) ? 'fa-check' : 'fa-file-circle-plus'} text-sm"></i>
            </button>
            <button
              type="button"
              data-star-id="${q.id}"
              class="star-toggle-btn w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
                isStarred
                  ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 text-amber-500 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 text-slate-400 hover:text-amber-500 hover:border-amber-300'
              }"
              title="${isStarred ? 'তারকাচিহ্ন সরান' : 'আমার গুরুত্বপূর্ণ তালিকায় যোগ করুন'}"
            >
              <i class="fa-solid fa-star text-sm"></i>
            </button>
            <button
              type="button"
              data-copy-id="${q.id}"
              class="copy-q-btn w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-300 transition-all"
              title="প্রশ্নটি কপি করুন"
            >
              <i class="fa-regular fa-copy text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Main Question Text -->
        <div class="text-lg sm:text-[20px] font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
          <span class="text-indigo-600 dark:text-indigo-400 mr-1">${escapeHtml(q.q_no_bn)}।</span>
          <span>${mainHighlighted}</span>
          ${mainYearsTag}
        </div>

        <!-- Alternatives (অথবা) Section -->
        ${
          q.alternatives && q.alternatives.length > 0
            ? `<div class="mt-3 pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-700/80 space-y-2">
                ${q.alternatives.map(alt => `
                  <div class="flex items-start gap-2.5 pl-2.5 sm:pl-3.5 border-l-3 border-indigo-400 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 py-2 px-3 rounded-r-xl">
                    <span class="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 mt-0.5">
                      অথবা
                    </span>
                    <div class="text-base sm:text-[18px] font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                      ${highlightText(alt.text, expandedSearch)}
                      ${
                        alt.years && alt.years.length > 0
                          ? `<span class="inline-flex items-center ml-1.5 px-2.5 py-0.5 rounded-md text-xs sm:text-[13px] font-semibold bg-emerald-50 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">[${formatBoardYearsText(alt.years)}]</span>`
                          : ''
                      }
                    </div>
                  </div>
                `).join('')}
              </div>`
            : ''
        }
      </article>
    `;
  }

  // Render Main Questions Feed
  function renderQuestionsFeed(filteredQuestions) {
    const container = document.getElementById('questions-feed-container');
    if (!container) return;

    const expandedSearch = getExpandedSearchTerms(state.searchQuery);

    // Special empty state if Trade-1 or Trade-2 is selected and has no questions yet
    if (
      (state.activeTrade === 'trade-1' || state.activeTrade === 'trade-2') &&
      state.questions.filter(q => q.trade_id === state.activeTrade).length === 0
    ) {
      const meta = TRADES_META[state.activeTrade];
      container.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800/70 p-8 sm:p-12 text-center max-w-2xl mx-auto my-4">
          <div class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 text-2xl shadow-xs">
            <i class="fa-solid ${meta.icon}"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
            ${escapeHtml(meta.title)} — ${escapeHtml(meta.classLabel)}
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            আপনি জানিয়েছেন যে <strong>${escapeHtml(meta.shortLabel)}</strong>-এর প্রশ্নব্যাংক পরে প্রদান করবেন। আপনি যেকোনো সময় নিচের বাটনে ক্লিক করে ওয়ার্ড ফাইলের প্রশ্নগুলো কপি-পেস্ট করে সরাসরি যুক্ত করতে পারেন, অথবা চ্যাটে প্রদান করলে স্বয়ংক্রিয়ভাবে যুক্ত করে দেওয়া হবে।
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              data-open-import="${state.activeTrade}"
              class="open-import-for-trade inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
            >
              <i class="fa-solid fa-file-import"></i>
              <span>${escapeHtml(meta.shortLabel)}-এর প্রশ্ন পেস্ট / ইম্পোর্ট করুন</span>
            </button>
            <button
              type="button"
              id="switch-to-trade-3-btn"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-all"
            >
              <span>সকল ট্রেড দেখুন (৭২৭টি প্রশ্ন)</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;

      const impBtn = container.querySelector('.open-import-for-trade');
      if (impBtn) {
        impBtn.addEventListener('click', () => {
          openImportModal(state.activeTrade);
        });
      }
      const swBtn = document.getElementById('switch-to-trade-3-btn');
      if (swBtn) {
        swBtn.addEventListener('click', () => {
          state.activeTrade = 'all';
          renderAll();
        });
      }
      return;
    }

    if (filteredQuestions.length === 0) {
      container.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-10 text-center my-4">
          <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-3 text-xl">
            <i class="fa-solid fa-magnifying-glass-minus"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">কোনো প্রশ্ন পাওয়া যায়নি</h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-md mx-auto">
            আপনার নির্বাচিত ফিল্টার বা সার্চ কীওয়ার্ডের সাথে মিলে এমন কোনো প্রশ্ন পাওয়া যায়নি। অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।
          </p>
          <button
            type="button"
            id="empty-reset-btn"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
          >
            <i class="fa-solid fa-rotate-left"></i> সকল ফিল্টার রিসেট করুন
          </button>
        </div>
      `;
      const btn = document.getElementById('empty-reset-btn');
      if (btn) btn.addEventListener('click', resetAllFilters);
      return;
    }

    // View mode: 'grouped' vs 'list' vs 'compact'
    if (state.viewMode === 'grouped' && state.sortBy === 'serial') {
      // Group by Trade -> Chapter -> Section
      const chapterGroups = [];
      const groupMap = new Map();

      filteredQuestions.forEach(q => {
        const gKey = `${q.trade_id}::${q.chapter}`;
        if (!groupMap.has(gKey)) {
          const grp = {
            key: gKey,
            trade_id: q.trade_id,
            trade_name: q.trade_name,
            chapter: q.chapter,
            sections: new Map(),
            totalCount: 0,
            boardCount: 0
          };
          groupMap.set(gKey, grp);
          chapterGroups.push(grp);
        }
        const grp = groupMap.get(gKey);
        grp.totalCount++;
        if (q.board_years && q.board_years.length > 0) grp.boardCount++;

        if (!grp.sections.has(q.section)) {
          grp.sections.set(q.section, []);
        }
        grp.sections.get(q.section).push(q);
      });

      container.innerHTML = chapterGroups.map(grp => {
        const isCollapsed = state.collapsedGroups.has(grp.key);
        const sectionsHtml = Array.from(grp.sections.entries()).map(([secName, qs]) => {
          const sampleQ = qs[0];
          const tMeta = TYPE_META[sampleQ.base_type] || TYPE_META['very_short'];
          return `
            <div class="mb-6 last:mb-0">
              <div class="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs ${tMeta.numClass}">
                    <i class="fa-solid ${tMeta.icon}"></i>
                  </span>
                  <h4 class="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                    ❖ ${escapeHtml(secName)}
                  </h4>
                </div>
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  ${toBnNum(qs.length)}টি প্রশ্ন
                </span>
              </div>
              <div class="space-y-3">
                ${qs.map(q => renderQuestionCard(q, expandedSearch, false)).join('')}
              </div>
            </div>
          `;
        }).join('');

        return `
          <section class="mb-6 bg-slate-50/70 dark:bg-slate-900/50 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden">
            <!-- Chapter Group Header -->
            <div
              data-group-toggle="${escapeHtml(grp.key)}"
              class="chapter-group-header cursor-pointer select-none bg-white dark:bg-slate-800 px-4 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 hover:bg-indigo-50/30 dark:hover:bg-slate-800/80 transition-colors"
            >
              <div class="flex items-center gap-3">
                <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-2xs">
                  ${escapeHtml(getShortTradeBadge(grp.trade_id, grp.trade_name))}
                </span>
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    ${escapeHtml(grp.chapter)}
                  </h3>
                </div>
              </div>
              <div class="flex items-center gap-2 ml-auto">
                <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  মোট ${toBnNum(grp.totalCount)}টি প্রশ্ন
                </span>
                ${
                  grp.boardCount > 0
                    ? `<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        বোর্ড ${toBnNum(grp.boardCount)}টি
                      </span>`
                    : ''
                }
                <span class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}">
                  <i class="fa-solid fa-chevron-down text-xs"></i>
                </span>
              </div>
            </div>
            <!-- Chapter Group Body -->
            <div class="p-3 sm:p-5 ${isCollapsed ? 'hidden' : ''}">
              ${sectionsHtml}
            </div>
          </section>
        `;
      }).join('');
    } else if (state.viewMode === 'compact') {
      container.innerHTML = `
        <div class="space-y-2">
          ${filteredQuestions.map(q => renderQuestionCard(q, expandedSearch, true)).join('')}
        </div>
      `;
    } else {
      // Flat sorted list view (also used automatically when sorting by importance/board year/etc.)
      container.innerHTML = `
        <div class="space-y-3">
          ${filteredQuestions.map(q => renderQuestionCard(q, expandedSearch, false)).join('')}
        </div>
      `;
    }

    // Bind events inside feed
    bindFeedEvents(container);
  }

  function bindFeedEvents(container) {
    // Group header collapse/expand
    container.querySelectorAll('.chapter-group-header').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const key = hdr.getAttribute('data-group-toggle');
        if (state.collapsedGroups.has(key)) {
          state.collapsedGroups.delete(key);
        } else {
          state.collapsedGroups.add(key);
        }
        renderAll();
      });
    });

    // Quick Add to Question Paper buttons
    container.querySelectorAll('.qb-quick-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qid = btn.getAttribute('data-qb-quick-add');
        toggleQuestionInPaperById(qid);
        renderAll();
      });
    });

    // Star toggle buttons
    container.querySelectorAll('.star-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qid = btn.getAttribute('data-star-id');
        if (state.starredIds.has(qid)) {
          state.starredIds.delete(qid);
          showToast('তারকাচিহ্নিত তালিকা থেকে সরানো হয়েছে');
        } else {
          state.starredIds.add(qid);
          showToast('★ আমার গুরুত্বপূর্ণ তালিকায় যুক্ত হয়েছে!');
        }
        saveStarredToStorage();
        renderAll();
      });
    });

    // Copy question buttons
    container.querySelectorAll('.copy-q-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qid = btn.getAttribute('data-copy-id');
        const q = state.questions.find(item => item.id === qid);
        if (!q) return;
        const formatted = formatQuestionForCopy(q);
        navigator.clipboard.writeText(formatted).then(() => {
          showToast('প্রশ্নটি ক্লিপবোর্ডে কপি করা হয়েছে!');
        });
      });
    });

    // Clickable board year pills
    container.querySelectorAll('.board-year-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const yr = btn.getAttribute('data-year-pill');
        state.activeBoardYear = yr;
        syncControlInputs();
        renderAll();
        showToast(`বাকাশিবো-${toBnNum(yr)} সালের প্রশ্ন ফিল্টার করা হয়েছে`);
      });
    });
  }

  function formatQuestionForCopy(q) {
    let line = `${q.question}`;
    if (q.main_years && q.main_years.length) {
      line += ` [${formatBoardYearsText(q.main_years)}]`;
    }
    if (q.alternatives && q.alternatives.length) {
      q.alternatives.forEach(alt => {
        line += `\nঅথবা, ${alt.text}`;
        if (alt.years && alt.years.length) {
          line += ` [${formatBoardYearsText(alt.years)}]`;
        }
      });
    }
    return line;
  }

  // Toast notification helper
  let toastTimeout = null;
  function showToast(msg) {
    const toast = document.getElementById('vi-toast');
    const toastText = document.getElementById('vi-toast-text');
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.remove('translate-y-16', 'opacity-0', 'pointer-events-none');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('translate-y-16', 'opacity-0', 'pointer-events-none');
    }, 2600);
  }

  // Render Board Analytics Modal Content
  function renderAnalyticsModal() {
    const bodyEl = document.getElementById('analytics-modal-body');
    if (!bodyEl) return;

    const allQs = state.questions;
    const yearMap = {};
    allQs.forEach(q => {
      (q.board_years || []).forEach(y => {
        yearMap[y] = (yearMap[y] || 0) + 1;
      });
    });

    const yearsSorted = Object.keys(yearMap).map(Number).sort((a, b) => b - a);
    const maxYearCount = Math.max(1, ...Object.values(yearMap));

    // Chapter summary
    const chStats = [];
    const chMap = new Map();
    allQs.forEach(q => {
      const k = `${q.trade_id}::${q.chapter}`;
      if (!chMap.has(k)) {
        const item = {
          key: k,
          trade_name: getShortTradeBadge(q.trade_id, q.trade_name),
          chapter: q.chapter,
          total: 0,
          board: 0,
          top: 0
        };
        chMap.set(k, item);
        chStats.push(item);
      }
      const st = chMap.get(k);
      st.total++;
      if (q.board_years && q.board_years.length > 0) st.board++;
      if (q.importance_tier === 'top') st.top++;
    });

    bodyEl.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Year-wise Board Question Distribution -->
        <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700">
          <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <i class="fa-solid fa-chart-column text-emerald-600"></i>
            <span>সালভিত্তিক বাকাশিবো বোর্ড প্রশ্ন (২০০৯–২০২৬)</span>
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">যেকোনো সালে ক্লিক করলে ওই সালের সকল বোর্ড প্রশ্ন ফিল্টার হয়ে যাবে।</p>
          <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            ${yearsSorted.map(yr => {
              const cnt = yearMap[yr];
              const pct = Math.round((cnt / maxYearCount) * 100);
              return `
                <button
                  type="button"
                  data-analytics-year="${yr}"
                  class="analytics-year-btn w-full group text-left hover:bg-white dark:hover:bg-slate-800 p-2 rounded-xl transition-all border border-transparent hover:border-emerald-300 dark:hover:border-emerald-700"
                >
                  <div class="flex items-center justify-between text-xs font-semibold mb-1">
                    <span class="text-slate-700 dark:text-slate-200 group-hover:text-emerald-600">বাকাশিবো-${toBnNum(yr)}</span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">${toBnNum(cnt)}টি প্রশ্ন</span>
                  </div>
                  <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full transition-all" style="width: ${pct}%"></div>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Chapter-wise Breakdown -->
        <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700">
          <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <i class="fa-solid fa-table-list text-indigo-600"></i>
            <span>অধ্যায়ভিত্তিক প্রশ্ন ও গুরুত্বের পরিসংখ্যান</span>
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">যেকোনো অধ্যায়ে ক্লিক করে সরাসরি সেই অধ্যায়ের প্রশ্নসমূহ দেখুন।</p>
          <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
            ${chStats.map(st => `
              <button
                type="button"
                data-analytics-chapter="${escapeHtml(st.key)}"
                class="analytics-ch-btn w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 transition-all flex items-center justify-between gap-2"
              >
                <div class="min-w-0">
                  <div class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">${escapeHtml(st.trade_name)}</div>
                  <div class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">${escapeHtml(st.chapter)}</div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 text-[11px] font-semibold">
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">মোট ${toBnNum(st.total)}</span>
                  <span class="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">বোর্ড ${toBnNum(st.board)}</span>
                  <span class="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300">★★★ ${toBnNum(st.top)}</span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    bodyEl.querySelectorAll('.analytics-year-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeBoardYear = btn.getAttribute('data-analytics-year');
        closeModal('analytics-modal');
        syncControlInputs();
        renderAll();
      });
    });

    bodyEl.querySelectorAll('.analytics-ch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chKey = btn.getAttribute('data-analytics-chapter');
        state.activeTrade = 'all';
        state.activeChapter = chKey;
        closeModal('analytics-modal');
        syncControlInputs();
        renderAll();
      });
    });
  }

  // Smart Raw Text Parser for Question Importer (Trade 1, 2, 3, 4)
  function parseImportedRawText(rawText, defaultTradeId) {
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const tradeNames = {
      'trade-1': 'ট্রেড-১ (IoT Basics-1)',
      'trade-2': 'ট্রেড-২ (IoT Basics-2)',
      'trade-3': 'ট্রেড-৩ (IoT Basics-3)',
      'trade-4': 'ট্রেড-৪ (IoT Basics-4)'
    };

    let currentTradeId = defaultTradeId || 'trade-1';
    let currentChapter = 'অধ্যায়-১: সাধারণ প্রশ্নোত্তর';
    let currentChapterNum = 1;
    let currentSection = 'অতি সংক্ষিপ্ত প্রশ্নোত্তর';
    let currentBaseType = 'very_short';

    const parsedQuestions = [];
    let counter = Date.now();

    function extractYearsFromLine(txt) {
      const yrs = new Set();
      const regex = /(?:বাকাশিবো|রাকাশিবো)[-–—:\s]*([০-৯0-9,\s]+)/g;
      let m;
      while ((m = regex.exec(txt)) !== null) {
        const parts = m[1].split(/[,\s]+/);
        parts.forEach(p => {
          const en = toEnNum(p).trim();
          if (/^\d+$/.test(en)) {
            const num = en.length === 2 ? 2000 + parseInt(en, 10) : parseInt(en, 10);
            if (num >= 2000 && num <= 2035) yrs.add(num);
          }
        });
      }
      return Array.from(yrs).sort((a, b) => a - b);
    }

    function stripBoardTag(txt) {
      return txt.replace(/\s*[\[(]*\s*(?:বাকাশিবো|রাকাশিবো)[-–—:\s]*[০-৯0-9,\s]+[\])।]*\s*$/, '').trim();
    }

    lines.forEach(rawLine => {
      const line = rawLine.replace(/\*\*/g, '').trim();
      if (!line) return;

      if (line === 'ট্রেড-১' || line.includes('ট্রেড-১:') || line.toLowerCase().includes('iot basics-1')) {
        currentTradeId = 'trade-1';
        return;
      }
      if (line === 'ট্রেড-২' || line.includes('ট্রেড-২:') || line.toLowerCase().includes('iot basics-2')) {
        currentTradeId = 'trade-2';
        return;
      }
      if (line === 'ট্রেড-৩') {
        currentTradeId = 'trade-3';
        return;
      }
      if (line === 'ট্রেড-৪') {
        currentTradeId = 'trade-4';
        return;
      }

      if (line.startsWith('অধ্যায়-')) {
        currentChapter = line;
        const mCh = line.match(/^অধ্যায়-([০-৯0-9]+)/);
        currentChapterNum = mCh ? parseInt(toEnNum(mCh[1]), 10) : 1;
        return;
      }

      if (line.startsWith('❖') || line.endsWith('প্রশ্নোত্তর') || line.includes('ব্যবহারিক (Practical)')) {
        const sec = line.replace(/^❖\s*/, '').trim();
        currentSection = sec;
        if (sec.includes('অতি সংক্ষিপ্ত')) currentBaseType = 'very_short';
        else if (sec.includes('সংক্ষিপ্ত')) currentBaseType = 'short';
        else if (sec.includes('রচনামূলক')) currentBaseType = 'broad';
        else if (sec.includes('ব্যবহারিক') || sec.toLowerCase().includes('practical')) currentBaseType = 'practical';
        return;
      }

      if (line.startsWith('অথবা')) {
        const altRaw = line.replace(/^অথবা[,:\s]*/, '').trim();
        const yrs = extractYearsFromLine(altRaw);
        const cleanAlt = stripBoardTag(altRaw);
        if (parsedQuestions.length > 0) {
          const prev = parsedQuestions[parsedQuestions.length - 1];
          prev.alternatives.push({ text: cleanAlt, years: yrs });
          const mergedYrs = new Set([...prev.board_years, ...yrs]);
          prev.board_years = Array.from(mergedYrs).sort((a, b) => a - b);
          prev.board_count += yrs.length;
          if (prev.board_years.length >= 2 || prev.board_count >= 2) prev.importance_tier = 'top';
          else if (prev.board_years.length >= 1) prev.importance_tier = 'important';
          prev.importance_score = prev.board_years.length * 25 + (prev.alternatives.length * 12) + (prev.is_extra ? 0 : 18);
        }
        return;
      }

      const mQ = line.match(/^([০-৯0-9]+)[।.)]\s*(.+)$/);
      if (mQ) {
        const qNoBn = toBnNum(mQ[1]);
        const qNo = parseInt(toEnNum(mQ[1]), 10) || 1;
        const body = mQ[2].trim();
        const yrs = extractYearsFromLine(body);
        const cleanQ = stripBoardTag(body);
        const isExtra = currentSection.includes('অতিরিক্ত');
        counter++;

        const tier = yrs.length >= 2 ? 'top' : (yrs.length >= 1 || !isExtra) ? 'important' : 'standard';
        const score = yrs.length * 25 + (yrs.includes(2025) ? 30 : 0) + (yrs.includes(2024) ? 25 : 0) + (isExtra ? 0 : 18);

        parsedQuestions.push({
          id: `custom-${counter}`,
          trade_id: currentTradeId,
          trade_name: tradeNames[currentTradeId] || 'ট্রেড-১ (IoT Basics-1)',
          chapter: currentBaseType === 'practical' ? 'ব্যবহারিক (Practical)' : currentChapter,
          chapter_num: currentBaseType === 'practical' ? 5 : currentChapterNum,
          section: currentSection,
          base_type: currentBaseType,
          is_extra: isExtra,
          q_no_bn: qNoBn,
          q_no: qNo,
          question: cleanQ,
          main_years: yrs,
          alternatives: [],
          board_years: yrs,
          board_count: yrs.length,
          importance_score: score,
          importance_tier: tier,
          topic_tags: []
        });
      }
    });

    return parsedQuestions;
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('hidden');
      el.classList.add('flex');
    }
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('flex');
    }
  }

  function openImportModal(defaultTrade) {
    const selectEl = document.getElementById('import-trade-select');
    if (selectEl && defaultTrade && defaultTrade !== 'all') {
      selectEl.value = defaultTrade;
    }
    openModal('import-modal');
  }

  // Main render orchestrator
  function renderAll() {
    saveFiltersToStorage();
    renderHeaderAndTrades();
    renderPresetBar();
    renderTopicChips();
    renderChapterNavigation();
    renderBoardYearDropdown();
    syncControlInputs();
    const filtered = getFilteredQuestions();
    renderActiveFilterChips(filtered);
    renderQuestionsFeed(filtered);

    // Update print header info
    const printSub = document.getElementById('print-filter-summary');
    if (printSub) {
      const tradeTitle = TRADES_META[state.activeTrade]?.title || 'সকল ট্রেড';
      printSub.textContent = `${tradeTitle} • মোট প্রশ্ন: ${toBnNum(filtered.length)}টি`;
    }
  }

  // Initialize DOM Events
  function initEvents() {
    // Search Input
    const searchInput = document.getElementById('main-search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle('hidden', !state.searchQuery.trim());
        }
        renderAll();
      });
    }
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        state.searchQuery = '';
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        clearSearchBtn.classList.add('hidden');
        renderAll();
      });
    }

    // Search Scope
    const scopeSelect = document.getElementById('search-scope-select');
    if (scopeSelect) {
      scopeSelect.addEventListener('change', (e) => {
        state.searchScope = e.target.value;
        renderAll();
      });
    }

    // Filter selects
    const typeSelect = document.getElementById('filter-question-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        state.activeType = e.target.value;
        renderAll();
      });
    }

    const sourceSelect = document.getElementById('filter-question-source');
    if (sourceSelect) {
      sourceSelect.addEventListener('change', (e) => {
        state.activeSource = e.target.value;
        renderAll();
      });
    }

    const yearSelect = document.getElementById('filter-board-year');
    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        state.activeBoardYear = e.target.value;
        renderAll();
      });
    }

    const sortSelect = document.getElementById('sort-by-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        syncControlInputs();
        renderAll();
      });
    }

    const sidebarSortSelect = document.getElementById('sidebar-sort-select');
    if (sidebarSortSelect) {
      sidebarSortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        syncControlInputs();
        renderAll();
      });
    }

    const mobileChapterSelect = document.getElementById('mobile-chapter-select');
    if (mobileChapterSelect) {
      mobileChapterSelect.addEventListener('change', (e) => {
        state.activeChapter = e.target.value;
        renderAll();
      });
    }

    // View mode buttons
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.viewMode = btn.getAttribute('data-view');
        syncControlInputs();
        renderAll();
      });
    });

    // Expand / Collapse All Chapters button
    const toggleAllChaptersBtn = document.getElementById('toggle-all-chapters-btn');
    if (toggleAllChaptersBtn) {
      toggleAllChaptersBtn.addEventListener('click', () => {
        if (state.collapsedGroups.size > 0) {
          state.collapsedGroups.clear();
          showToast('সকল অধ্যায় প্রসারিত করা হয়েছে');
        } else {
          const allKeys = new Set(state.questions.map(q => `${q.trade_id}::${q.chapter}`));
          state.collapsedGroups = allKeys;
          showToast('সকল অধ্যায় সংকুচিত করা হয়েছে');
        }
        renderAll();
      });
    }

    // Copy All Filtered Questions button
    const copyAllBtn = document.getElementById('copy-filtered-btn');
    if (copyAllBtn) {
      copyAllBtn.addEventListener('click', () => {
        const filtered = getFilteredQuestions();
        if (!filtered.length) {
          showToast('কপি করার মতো কোনো প্রশ্ন নেই');
          return;
        }
        const textBlock = filtered.map(q => formatQuestionForCopy(q)).join('\n\n');
        navigator.clipboard.writeText(textBlock).then(() => {
          showToast(`${toBnNum(filtered.length)}টি প্রশ্ন ক্লিপবোর্ডে কপি করা হয়েছে!`);
        });
      });
    }

    // Print button
    const printBtn = document.getElementById('print-questions-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Dark Mode Toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        state.darkMode = !state.darkMode;
        document.documentElement.classList.toggle('dark', state.darkMode);
        try {
          localStorage.setItem('vi_dark_mode', String(state.darkMode));
        } catch (e) {}
      });
    }

    // Open Analytics Modal
    const openAnalyticsBtn = document.getElementById('open-analytics-btn');
    if (openAnalyticsBtn) {
      openAnalyticsBtn.addEventListener('click', () => {
        renderAnalyticsModal();
        openModal('analytics-modal');
      });
    }

    // Open Import Modal
    const openImportBtn = document.getElementById('open-import-btn');
    if (openImportBtn) {
      openImportBtn.addEventListener('click', () => {
        openImportModal(state.activeTrade !== 'all' ? state.activeTrade : 'trade-1');
      });
    }

    // Close modals
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        closeModal(btn.getAttribute('data-close-modal'));
      });
    });

    // Process Import Button
    const confirmImportBtn = document.getElementById('confirm-import-btn');
    if (confirmImportBtn) {
      confirmImportBtn.addEventListener('click', () => {
        const tradeId = document.getElementById('import-trade-select')?.value || 'trade-1';
        const rawInput = document.getElementById('import-raw-textarea')?.value || '';
        if (!rawInput.trim()) {
          showToast('অনুগ্রহ করে প্রশ্নসমূহ পেস্ট করুন');
          return;
        }
        const newQs = parseImportedRawText(rawInput, tradeId);
        if (newQs.length === 0) {
          showToast('কোনো ক্রমিক প্রশ্ন (যেমন: ১। ...) শনাক্ত করা যায়নি');
          return;
        }
        try {
          const existingCustom = JSON.parse(localStorage.getItem('vi_custom_questions') || '[]');
          const updatedCustom = [...existingCustom, ...newQs];
          localStorage.setItem('vi_custom_questions', JSON.stringify(updatedCustom));
          state.questions = [...(window.INITIAL_QUESTIONS_DATA || []), ...updatedCustom];
          state.activeTrade = tradeId;
          state.activeChapter = 'all';
          document.getElementById('import-raw-textarea').value = '';
          closeModal('import-modal');
          renderAll();
          showToast(`সফলভাবে ${toBnNum(newQs.length)}টি নতুন প্রশ্ন যুক্ত হয়েছে!`);
        } catch (err) {
          console.error(err);
          showToast('প্রশ্ন সংরক্ষণে সমস্যা হয়েছে');
        }
      });
    }

    // Clear Custom Imported Questions Button
    const clearCustomBtn = document.getElementById('clear-custom-questions-btn');
    if (clearCustomBtn) {
      clearCustomBtn.addEventListener('click', () => {
        localStorage.removeItem('vi_custom_questions');
        state.questions = [...(window.INITIAL_QUESTIONS_DATA || [])];
        renderAll();
        showToast('কাস্টম সংযোজিত প্রশ্ন রিসেট করা হয়েছে');
      });
    }

    // Top KPI Card Quick Click Filters
    const kpiCardTotal = document.getElementById('kpi-card-total');
    if (kpiCardTotal) {
      kpiCardTotal.addEventListener('click', () => {
        state.activePreset = 'all';
        renderAll();
      });
    }
    const kpiCardBoard = document.getElementById('kpi-card-board');
    if (kpiCardBoard) {
      kpiCardBoard.addEventListener('click', () => {
        state.activePreset = 'board_all';
        renderAll();
      });
    }
    const kpiCardTop = document.getElementById('kpi-card-top');
    if (kpiCardTop) {
      kpiCardTop.addEventListener('click', () => {
        state.activePreset = 'top_important';
        renderAll();
      });
    }
    const kpiCardStarred = document.getElementById('kpi-card-starred');
    if (kpiCardStarred) {
      kpiCardStarred.addEventListener('click', () => {
        state.activePreset = 'starred';
        renderAll();
      });
    }

    // Keyboard shortcut '/' or Ctrl+K to focus search
    window.addEventListener('keydown', (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && document.activeElement !== searchInput && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInput?.focus();
      }
      if (e.key === 'Escape') {
        closeModal('analytics-modal');
        closeModal('import-modal');
        closeModal('question-builder-modal');
        hidePwaInstallToast();
      }
    });

    initPwaInstallFeature();
    initQuestionBuilder();
  }

  // ============================================================================
  // MAKE QUESTION STUDIO (প্রশ্নপত্র তৈরি ও ডাবল-ক্লিক সিঙ্গেল প্রশ্ন সিলেক্টর)
  // ============================================================================
  function getDefaultSubjectLineForTrade(tradeId, chapterKey) {
    const map = {
      'trade-1': 'বিষয়: আইটি সাপোর্ট এন্ড আইওটি বেসিকস-১ (Trade-1)',
      'trade-2': 'বিষয়: আইটি সাপোর্ট এন্ড আইওটি বেসিকস-২ (Trade-2)',
      'trade-3': 'বিষয়: আইটি সাপোর্ট এন্ড আইওটি বেসিকস-৩ (Trade-3)',
      'trade-4': 'বিষয়: আইটি সাপোর্ট এন্ড আইওটি বেসিকস-৪ (Trade-4)',
      'all': 'বিষয়: আইটি সাপোর্ট এন্ড আইওটি বেসিকস (সকল ট্রেড)'
    };
    const base = map[tradeId] || map['trade-4'];
    if (chapterKey && chapterKey !== 'all') {
      const chText = chapterKey.includes('::') ? chapterKey.split('::')[1] : chapterKey;
      return `${base} • ${chText}`;
    }
    return base;
  }

  const qbState = {
    tradeId: 'trade-4',
    chapterKey: 'all',
    qType: 'mixed_board', // 'mixed_board', 'very_short', 'short', 'broad', 'all'
    targetMarks: 60,
    institution: 'সফির উদ্দিন হাই স্কুল এন্ড কলেজ',
    examName: 'দশম (ভোকেশনাল) শ্রেণি টেস্ট পরীক্ষা-২০২৬',
    subjectLine: 'বিষয়: আইটি সাপোর্ট এন্ড আইওটি বেসিকস-৪ (Trade-4)',
    customSubjectEdited: false,
    examTime: '৩ ঘন্টা',
    instruction: '[দ্রষ্টব্য: ক-বিভাগের সকল, খ-বিভাগের যে কোন ১০টি এবং গ-বিভাগের যে কোন ৫টি প্রশ্নের উত্তর দাও]',
    showBoardTags: false,
    poolSearch: '',
    poolPriority: 'all', // 'all', 'top', 'board', '2026', 'starred'
    mobileTab: 'paper', // 'pool' or 'paper'
    editingItemId: null, // item uid currently in inline edit mode
    generationSeed: 0,
    items: [] // Array of { uid, sourceId, question, marks, base_type, board_years, chapter, trade_id }
  };

  function getDefaultMarkForType(baseType) {
    if (baseType === 'very_short') return 1;
    if (baseType === 'short') return 2;
    if (baseType === 'broad') return 4;
    if (baseType === 'practical') return 5;
    return 2;
  }

  function loadQbStateFromStorage() {
    try {
      const saved = localStorage.getItem('vi_qb_state_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.items)) qbState.items = parsed.items;
          if (typeof parsed.tradeId === 'string') qbState.tradeId = parsed.tradeId;
          if (typeof parsed.chapterKey === 'string') qbState.chapterKey = parsed.chapterKey;
          if (typeof parsed.qType === 'string') qbState.qType = parsed.qType;
          if (typeof parsed.institution === 'string') qbState.institution = parsed.institution;
          if (typeof parsed.examName === 'string') qbState.examName = parsed.examName;
          if (typeof parsed.subjectLine === 'string') qbState.subjectLine = parsed.subjectLine;
          if (typeof parsed.customSubjectEdited === 'boolean') qbState.customSubjectEdited = parsed.customSubjectEdited;
          if (typeof parsed.examTime === 'string') qbState.examTime = parsed.examTime;
          if (parsed.targetMarks) qbState.targetMarks = Number(parsed.targetMarks) || 60;
          if (typeof parsed.instruction === 'string') qbState.instruction = parsed.instruction;
          if (typeof parsed.showBoardTags === 'boolean') qbState.showBoardTags = parsed.showBoardTags;
          if (typeof parsed.poolSearch === 'string') qbState.poolSearch = parsed.poolSearch;
          if (typeof parsed.poolPriority === 'string') qbState.poolPriority = parsed.poolPriority;
          if (parsed.mobileTab === 'pool' || parsed.mobileTab === 'paper') qbState.mobileTab = parsed.mobileTab;
        }
      }
    } catch (e) {
      console.error('QB load error:', e);
    }
    renderQbChapterOptions();
    syncStateToQbHeaderInputs();
    updateHeaderBuilderBadge();
  }

  function saveQbStateToStorage() {
    try {
      localStorage.setItem('vi_qb_state_v2', JSON.stringify({
        items: qbState.items,
        tradeId: qbState.tradeId,
        chapterKey: qbState.chapterKey,
        qType: qbState.qType,
        institution: qbState.institution,
        examName: qbState.examName,
        subjectLine: qbState.subjectLine,
        customSubjectEdited: qbState.customSubjectEdited,
        examTime: qbState.examTime,
        targetMarks: qbState.targetMarks,
        instruction: qbState.instruction,
        showBoardTags: qbState.showBoardTags,
        poolSearch: qbState.poolSearch,
        poolPriority: qbState.poolPriority,
        mobileTab: qbState.mobileTab
      }));
    } catch (e) {}
    updateHeaderBuilderBadge();
  }

  function updateHeaderBuilderBadge() {
    const badge = document.getElementById('builder-count-badge');
    if (badge) {
      badge.textContent = toBnNum(qbState.items.length);
    }
  }

  function isInQuestionPaper(qid) {
    return qbState.items.some(item => item.sourceId === qid);
  }

  function createPaperItemFromQuestion(q, customMarks, customText) {
    const marks = customMarks !== undefined ? customMarks : getDefaultMarkForType(q.base_type);
    return {
      uid: `pitem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sourceId: q.id,
      question: customText || q.question,
      marks: Number(marks) || 1,
      base_type: q.base_type,
      board_years: q.board_years || [],
      chapter: q.chapter || '',
      chapter_num: q.chapter_num || 1,
      trade_id: q.trade_id || 'trade-4'
    };
  }

  // Place a question (or one of its Alternate `অথবা` variants) as a single standalone question in the paper
  function addOrReplaceSingleQuestion(q, chosenText) {
    const textToUse = (chosenText || q.question || '').trim();
    const existingIdx = qbState.items.findIndex(item => item.sourceId === q.id);
    if (existingIdx !== -1) {
      qbState.items[existingIdx].question = textToUse;
      saveQbStateToStorage();
      renderQbAll();
      renderAll();
      showToast(`প্রশ্ন ${toBnNum(existingIdx + 1)}-এ নির্বাচিত প্রশ্নটি একক প্রশ্ন হিসেবে বসানো হয়েছে!`);
    } else {
      qbState.items.push(createPaperItemFromQuestion(q, undefined, textToUse));
      saveQbStateToStorage();
      renderQbAll();
      renderAll();
      showToast('প্রশ্নপত্রে একক প্রশ্ন হিসেবে যুক্ত হয়েছে!');
    }
  }

  function toggleQuestionInPaperById(qid) {
    const existingIdx = qbState.items.findIndex(item => item.sourceId === qid);
    if (existingIdx !== -1) {
      qbState.items.splice(existingIdx, 1);
      saveQbStateToStorage();
      showToast('প্রশ্নপত্র থেকে প্রশ্নটি সরানো হয়েছে');
    } else {
      const q = state.questions.find(item => item.id === qid);
      if (!q) return;
      qbState.items.push(createPaperItemFromQuestion(q));
      saveQbStateToStorage();
      showToast('প্রশ্নপত্রে প্রশ্নটি যুক্ত হয়েছে! ("প্রশ্ন তৈরি" বাটনে ক্লিক করে দেখুন)');
    }
  }

  // Populate Chapter Select inside Question Builder based on selected Trade
  function renderQbChapterOptions() {
    const chSelect = document.getElementById('qb-chapter-select');
    if (!chSelect) return;

    const pool = state.questions.filter(q => qbState.tradeId === 'all' || q.trade_id === qbState.tradeId);
    const chMap = new Map();
    pool.forEach(q => {
      const k = `${q.trade_id}::${q.chapter}`;
      if (!chMap.has(k)) {
        chMap.set(k, {
          key: k,
          trade_id: q.trade_id,
          chapter: q.chapter,
          chapter_num: q.chapter_num,
          count: 0
        });
      }
      chMap.get(k).count++;
    });

    const chapters = Array.from(chMap.values()).sort((a, b) => {
      if (a.trade_id !== b.trade_id) return a.trade_id.localeCompare(b.trade_id);
      return a.chapter_num - b.chapter_num;
    });

    const validKeys = new Set(chapters.map(c => c.key));
    if (qbState.chapterKey !== 'all' && !validKeys.has(qbState.chapterKey)) {
      qbState.chapterKey = 'all';
    }

    let html = `<option class="bg-slate-900 text-white" value="all" ${qbState.chapterKey === 'all' ? 'selected' : ''}>সকল অধ্যায় (${toBnNum(pool.length)}টি প্রশ্ন)</option>`;
    chapters.forEach(ch => {
      const prefix = qbState.tradeId === 'all' ? `[${getShortTradeBadge(ch.trade_id)}] ` : '';
      html += `<option class="bg-slate-900 text-white" value="${escapeHtml(ch.key)}" ${qbState.chapterKey === ch.key ? 'selected' : ''}>${escapeHtml(prefix + ch.chapter)} (${toBnNum(ch.count)})</option>`;
    });

    chSelect.innerHTML = html;
  }

  // Filter candidate questions for Question Builder Pool & Auto-Generator
  function getQbCandidatePool(overrideType) {
    const typeToMatch = overrideType || qbState.qType;
    return state.questions.filter(q => {
      if (qbState.tradeId !== 'all' && q.trade_id !== qbState.tradeId) return false;
      if (qbState.chapterKey !== 'all') {
        const k = `${q.trade_id}::${q.chapter}`;
        if (k !== qbState.chapterKey && q.chapter !== qbState.chapterKey) return false;
      }
      if (typeToMatch !== 'all' && typeToMatch !== 'mixed_board') {
        if (q.base_type !== typeToMatch) return false;
      }
      return true;
    });
  }

  // Smart Auto-Generation of Exam Question Paper (Follows Trade-3.pdf 20 + 12 + 6 = 38 pattern for 60 marks)
  function autoGenerateExamPaper(appendMode = false) {
    syncQbInputsToState();
    qbState.generationSeed++;

    const targetMarks = Math.max(1, parseInt(qbState.targetMarks, 10) || 60);
    const existingIds = new Set(appendMode ? qbState.items.map(i => i.sourceId) : []);

    // Helper to pick `count` questions from a pool, sorted by importance, then ordered sequentially by chapter (1 -> 4) like Trade-3.pdf
    function pickQuestionsByCount(pool, unitMark, countNeeded) {
      const available = pool.filter(q => !existingIds.has(q.id));
      const scored = available.map((q, idx) => {
        const starBonus = state.starredIds.has(q.id) ? 80 : 0;
        const boardBonus = (q.board_years && q.board_years.length > 0) ? 50 : 0;
        const cycleOffset = ((idx + qbState.generationSeed * 3) % 7) * 5;
        return {
          q,
          rankScore: (q.importance_score || 0) + starBonus + boardBonus + cycleOffset
        };
      });
      scored.sort((a, b) => b.rankScore - a.rankScore);

      const selected = scored.slice(0, countNeeded).map(entry => entry.q);
      // Sort selected questions chapter-wise (Chapter 1 -> 2 -> 3 -> 4) just like Trade-3.pdf
      selected.sort((a, b) => (a.chapter_num || 1) - (b.chapter_num || 1) || (a.q_no || 0) - (b.q_no || 0));

      return selected.map(q => {
        existingIds.add(q.id);
        return createPaperItemFromQuestion(q, unitMark);
      });
    }

    let generatedItems = [];

    if (qbState.qType === 'mixed_board') {
      const vsPool = getQbCandidatePool('very_short');
      const sPool = getQbCandidatePool('short');
      const bPool = getQbCandidatePool('broad');

      if (targetMarks === 60) {
        // Exact Trade-3.pdf Test Exam-2026 Pattern (60 Marks):
        // ক-বিভাগ (মান: ১ x ২০ = ২০) -> 20 very_short questions (all mandatory)
        // খ-বিভাগ (মান: ২ x ১০ = ২০) -> 12 short questions (any 10 mandatory)
        // গ-বিভাগ (মান: ৪ x ৫ = ২০) -> 6 broad questions (any 5 mandatory)
        generatedItems = [
          ...pickQuestionsByCount(vsPool, 1, 20),
          ...pickQuestionsByCount(sPool, 2, 12),
          ...pickQuestionsByCount(bPool, 4, 6)
        ];
        qbState.instruction = `[দ্রষ্টব্য: ক-বিভাগের সকল, খ-বিভাগের যে কোন ১০টি এবং গ-বিভাগের যে কোন ৫টি প্রশ্নের উত্তর দাও]`;
        qbState.examTime = '৩ ঘন্টা';
      } else {
        // Proportional split for other mark totals (e.g. 30, 20, 10)
        const vsCount = Math.max(2, Math.round((targetMarks * 0.34) / 1));
        const sCount = Math.max(2, Math.round((targetMarks * 0.33) / 2));
        const remMarks = Math.max(0, targetMarks - vsCount * 1 - sCount * 2);
        const bCount = Math.max(0, Math.round(remMarks / 4));

        generatedItems = [
          ...pickQuestionsByCount(vsPool, 1, vsCount),
          ...pickQuestionsByCount(sPool, 2, sCount),
          ...(bCount > 0 ? pickQuestionsByCount(bPool, 4, bCount) : [])
        ];
        qbState.instruction = `[দ্রষ্টব্য: ডান পাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক। সকল প্রশ্নের উত্তর দাও।]`;
      }
    } else {
      const pool = getQbCandidatePool(qbState.qType);
      const unitMark = qbState.qType === 'all' ? 2 : getDefaultMarkForType(qbState.qType);
      const countNeeded = Math.max(1, Math.ceil(targetMarks / unitMark));
      generatedItems = pickQuestionsByCount(pool, unitMark, countNeeded);

      const count = generatedItems.length;
      if (count > 0) {
        const typeLabel = TYPE_META[qbState.qType]?.fullLabel || 'প্রশ্নোত্তর';
        qbState.instruction = `[দ্রষ্টব্য: সকল প্রশ্নের উত্তর দাও। (${typeLabel}: ${toBnNum(unitMark)} x ${toBnNum(count)} = ${toBnNum(unitMark * count)})]`;
      }
    }

    if (generatedItems.length === 0) {
      showToast('নির্বাচিত ফিল্টারে পর্যাপ্ত প্রশ্ন পাওয়া যায়নি। অন্য অধ্যায় বা ধরন নির্বাচন করুন।');
      return;
    }

    if (appendMode) {
      qbState.items = [...qbState.items, ...generatedItems];
      showToast(`প্রশ্নপত্রে আরও ${toBnNum(generatedItems.length)}টি প্রশ্ন যোগ করা হয়েছে!`);
    } else {
      qbState.items = generatedItems;
      showToast(`সফলভাবে ${toBnNum(generatedItems.length)}টি প্রশ্নের (${toBnNum(targetMarks)} নম্বর) প্রশ্নপত্র তৈরি হয়েছে!`);
    }

    if (!qbState.customSubjectEdited) {
      qbState.subjectLine = getDefaultSubjectLineForTrade(qbState.tradeId, qbState.chapterKey);
    }

    syncStateToQbHeaderInputs();
    saveQbStateToStorage();
    renderQbAll();
    renderAll();
  }

  function syncQbInputsToState() {
    const tradeEl = document.getElementById('qb-trade-select');
    const chEl = document.getElementById('qb-chapter-select');
    const typeEl = document.getElementById('qb-type-select');
    const marksEl = document.getElementById('qb-total-marks-input');
    const instNameEl = document.getElementById('qb-institution-input');
    const examNameEl = document.getElementById('qb-exam-name-input');
    const subjLineEl = document.getElementById('qb-subject-line-input');
    const timeEl = document.getElementById('qb-exam-time-input');
    const instrEl = document.getElementById('qb-instruction-input');
    const showBoardEl = document.getElementById('qb-show-board-tags');

    if (tradeEl) qbState.tradeId = tradeEl.value;
    if (chEl) qbState.chapterKey = chEl.value;
    if (typeEl) qbState.qType = typeEl.value;
    if (marksEl) qbState.targetMarks = parseInt(marksEl.value, 10) || 60;
    if (instNameEl) qbState.institution = instNameEl.value.trim() || 'সফির উদ্দিন হাই স্কুল এন্ড কলেজ';
    if (examNameEl) qbState.examName = examNameEl.value.trim() || 'দশম (ভোকেশনাল) শ্রেণি টেস্ট পরীক্ষা-২০২৬';
    if (subjLineEl) qbState.subjectLine = subjLineEl.value.trim() || getDefaultSubjectLineForTrade(qbState.tradeId, qbState.chapterKey);
    if (timeEl) qbState.examTime = timeEl.value.trim() || '৩ ঘন্টা';
    if (instrEl) qbState.instruction = instrEl.value.trim();
    if (showBoardEl) qbState.showBoardTags = showBoardEl.checked;
  }

  function syncStateToQbHeaderInputs() {
    const instNameEl = document.getElementById('qb-institution-input');
    const examNameEl = document.getElementById('qb-exam-name-input');
    const subjLineEl = document.getElementById('qb-subject-line-input');
    const timeEl = document.getElementById('qb-exam-time-input');
    const instrEl = document.getElementById('qb-instruction-input');
    const trEl = document.getElementById('qb-trade-select');
    const chEl = document.getElementById('qb-chapter-select');
    const tpEl = document.getElementById('qb-type-select');
    const mkEl = document.getElementById('qb-total-marks-input');
    const showBoardEl = document.getElementById('qb-show-board-tags');
    const poolSearchEl = document.getElementById('qb-pool-search');
    const poolPriorityEl = document.getElementById('qb-pool-filter-priority');

    if (instNameEl && document.activeElement !== instNameEl) instNameEl.value = qbState.institution;
    if (examNameEl && document.activeElement !== examNameEl) examNameEl.value = qbState.examName;
    if (subjLineEl && document.activeElement !== subjLineEl) subjLineEl.value = qbState.subjectLine;
    if (timeEl && document.activeElement !== timeEl) timeEl.value = qbState.examTime;
    if (instrEl && document.activeElement !== instrEl) instrEl.value = qbState.instruction;
    if (trEl && document.activeElement !== trEl) trEl.value = qbState.tradeId;
    if (chEl && document.activeElement !== chEl) chEl.value = qbState.chapterKey;
    if (tpEl && document.activeElement !== tpEl) tpEl.value = qbState.qType;
    if (mkEl && document.activeElement !== mkEl) mkEl.value = qbState.targetMarks;
    if (showBoardEl) showBoardEl.checked = Boolean(qbState.showBoardTags);
    if (poolSearchEl && document.activeElement !== poolSearchEl) poolSearchEl.value = qbState.poolSearch || '';
    if (poolPriorityEl && document.activeElement !== poolPriorityEl) poolPriorityEl.value = qbState.poolPriority || 'all';
  }

  // Render Left Pane: Suggested Question Pool (Simple Click / Double-Click on Alternate, Zero Drag Hang)
  function renderQbPool() {
    const listEl = document.getElementById('qb-pool-list');
    const countBadge = document.getElementById('qb-pool-count-badge');
    const mobilePoolCount = document.getElementById('qb-mobile-pool-count');
    if (!listEl) return;

    let candidates = getQbCandidatePool();

    if (qbState.poolPriority === 'top') {
      candidates = candidates.filter(q => q.importance_tier === 'top');
    } else if (qbState.poolPriority === 'board') {
      candidates = candidates.filter(q => q.board_years && q.board_years.length > 0);
    } else if (qbState.poolPriority === '2026') {
      candidates = candidates.filter(q => q.board_years && q.board_years.includes(2026));
    } else if (qbState.poolPriority === 'starred') {
      candidates = candidates.filter(q => state.starredIds.has(q.id));
    }

    const expandedSearch = getExpandedSearchTerms(qbState.poolSearch);
    if (expandedSearch.length > 0) {
      candidates = candidates.filter(q => matchesSearch(q, expandedSearch));
    }

    candidates.sort((a, b) => (b.importance_score || 0) - (a.importance_score || 0));

    if (countBadge) countBadge.textContent = `${toBnNum(candidates.length)}টি প্রশ্ন`;
    if (mobilePoolCount) mobilePoolCount.textContent = toBnNum(candidates.length);

    if (candidates.length === 0) {
      listEl.innerHTML = `
        <div class="p-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          এই ফিল্টারে কোনো সাজেশন প্রশ্ন পাওয়া যায়নি।
        </div>
      `;
      return;
    }

    listEl.innerHTML = candidates.map(q => {
      const inPaper = isInQuestionPaper(q.id);
      const tMeta = TYPE_META[q.base_type] || TYPE_META['short'];
      const defaultMark = getDefaultMarkForType(q.base_type);
      const hasBoard = q.board_years && q.board_years.length > 0;
      const isTop = q.importance_tier === 'top';
      const alts = q.alternatives || [];

      return `
        <div
          data-pool-qid="${q.id}"
          class="qb-pool-card bg-white dark:bg-slate-800/95 rounded-xl p-3 border ${
            inPaper
              ? 'border-emerald-500/60 bg-emerald-50/20 dark:bg-emerald-950/20'
              : isTop
              ? 'border-rose-500/40 hover:border-indigo-500'
              : 'border-slate-200 dark:border-slate-700 hover:border-indigo-500'
          } shadow-2xs transition-all"
        >
          <div class="flex items-center justify-between gap-1.5 mb-1.5">
            <div class="flex flex-wrap items-center gap-1">
              <span class="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                ${escapeHtml(tMeta.label)} (${toBnNum(defaultMark)})
              </span>
              <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400">
                অধ্যায়-${toBnNum(q.chapter_num || 1)}
              </span>
              ${
                isTop
                  ? `<span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-500">★★★</span>`
                  : ''
              }
              ${
                hasBoard
                  ? `<span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500">[${formatBoardYearsText(q.board_years)}]</span>`
                  : ''
              }
            </div>
            <div class="flex items-center gap-1 shrink-0">
              ${
                inPaper
                  ? `<span class="text-[11px] font-bold text-emerald-500 px-1.5 py-0.5"><i class="fa-solid fa-check mr-0.5"></i>যুক্ত</span>`
                  : ''
              }
              <button
                type="button"
                data-pool-add="${q.id}"
                class="pool-add-btn px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xs transition-colors"
                title="মূল প্রশ্নটি একক প্রশ্ন হিসেবে যোগ করুন"
              >
                <i class="fa-solid fa-plus mr-0.5"></i>যোগ
              </button>
            </div>
          </div>

          <!-- Main Question (Double-click also places it as single question) -->
          <div
            data-dbl-main="${q.id}"
            class="pool-main-q cursor-pointer text-sm sm:text-[15px] font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-500 dark:hover:text-indigo-400 leading-snug py-0.5"
            title="ডাবল-ক্লিক করলে মূল প্রশ্নটি একক প্রশ্ন হিসেবে যুক্ত হবে"
          >
            ${escapeHtml(q.question)}
          </div>

          <!-- Alternate (অথবা) Questions: Double-click any Alternate to place it as a SINGLE question! -->
          ${
            alts.length > 0
              ? `<div class="mt-2 pt-1.5 border-t border-slate-200/70 dark:border-slate-700/70 space-y-1">
                  <div class="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                    <i class="fa-solid fa-angles-right"></i>
                    <span>বিকল্প প্রশ্ন (ডাবল-ক্লিক করলে একক প্রশ্ন হিসেবে প্রশ্নপত্রে বসবে):</span>
                  </div>
                  ${alts.map((alt, aIdx) => `
                    <div
                      data-dbl-alt-qid="${q.id}"
                      data-dbl-alt-idx="${aIdx}"
                      class="pool-alt-q cursor-pointer group flex items-center justify-between gap-2 px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-xs sm:text-[13px] font-medium text-slate-700 dark:text-slate-200 transition-colors select-none"
                      title="এই বিকল্প প্রশ্নটিতে ডাবল-ক্লিক করলে এটি একক প্রশ্ন হিসেবে প্রশ্নপত্রে যুক্ত হবে"
                    >
                      <span class="truncate"><strong class="text-indigo-400 mr-1">অথবা:</strong>${escapeHtml(alt.text)}</span>
                      <span class="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white opacity-80 group-hover:opacity-100">
                        ডাবল-ক্লিক / +
                      </span>
                    </div>
                  `).join('')}
                </div>`
              : ''
          }
        </div>
      `;
    }).join('');

    // 1. Click '+ যোগ' button -> add main question as single question
    listEl.querySelectorAll('.pool-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qid = btn.getAttribute('data-pool-add');
        const q = state.questions.find(item => item.id === qid);
        if (!q) return;
        addOrReplaceSingleQuestion(q, q.question);
      });
    });

    // 2. Double-click on Main Question -> add/replace as single question
    listEl.querySelectorAll('.pool-main-q').forEach(el => {
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const qid = el.getAttribute('data-dbl-main');
        const q = state.questions.find(item => item.id === qid);
        if (!q) return;
        addOrReplaceSingleQuestion(q, q.question);
      });
    });

    // 3. Double-click (or click badge) on Alternate (`অথবা`) Question -> places Alternate as a SINGLE standalone question!
    listEl.querySelectorAll('.pool-alt-q').forEach(el => {
      const handleSelectAlt = (e) => {
        e.stopPropagation();
        const qid = el.getAttribute('data-dbl-alt-qid');
        const aIdx = parseInt(el.getAttribute('data-dbl-alt-idx'), 10);
        const q = state.questions.find(item => item.id === qid);
        if (!q || !q.alternatives || !q.alternatives[aIdx]) return;
        addOrReplaceSingleQuestion(q, q.alternatives[aIdx].text);
      };
      el.addEventListener('dblclick', handleSelectAlt);
      el.addEventListener('click', handleSelectAlt);
    });
  }

  // Helper: Compute effective paper marks (handles Trade-3.pdf 60-mark Test Exam structure: 20 + 20 + 20 = 60)
  function getEffectivePaperMarks() {
    const rawSum = qbState.items.reduce((sum, item) => sum + (Number(item.marks) || 0), 0);
    if (qbState.qType === 'mixed_board' && Number(qbState.targetMarks) === 60 && qbState.items.length >= 25) {
      return 60;
    }
    return rawSum;
  }

  // Exact Section Headings following Trade-3.pdf
  function getSectionHeaderForMixedBoard(baseType) {
    const vsCount = qbState.items.filter(i => i.base_type === 'very_short').length;
    const sCount = qbState.items.filter(i => i.base_type === 'short').length;
    const bCount = qbState.items.filter(i => i.base_type === 'broad').length;
    const isTest60 = Number(qbState.targetMarks) === 60;

    if (baseType === 'very_short') {
      const c = isTest60 ? 20 : vsCount;
      return `ক-বিভাগ (মান: ১ x ${toBnNum(c)} = ${toBnNum(c)})`;
    }
    if (baseType === 'short') {
      const ansCount = isTest60 ? 10 : sCount;
      return `খ-বিভাগ (মান: ২ x ${toBnNum(ansCount)} = ${toBnNum(ansCount * 2)})`;
    }
    if (baseType === 'broad') {
      const ansCount = isTest60 ? 5 : bCount;
      return `গ-বিভাগ (মান: ৪ x ${toBnNum(ansCount)} = ${toBnNum(ansCount * 4)})`;
    }
    return '';
  }

  // Render Right Pane: Live Exam Question Paper Preview & Editor
  function renderQbPaper() {
    syncStateToQbHeaderInputs();

    const marksEl = document.getElementById('qb-paper-marks-display');
    const statQCount = document.getElementById('qb-stat-qcount');
    const statTargetMarks = document.getElementById('qb-stat-target-marks');
    const statCurrentMarks = document.getElementById('qb-stat-current-marks');
    const mobilePaperCount = document.getElementById('qb-mobile-paper-count');

    const totalCurrentMarks = getEffectivePaperMarks();

    if (marksEl) marksEl.textContent = toBnNum(totalCurrentMarks || qbState.targetMarks);
    if (statQCount) statQCount.textContent = toBnNum(qbState.items.length);
    if (statTargetMarks) statTargetMarks.textContent = toBnNum(qbState.targetMarks);
    if (statCurrentMarks) statCurrentMarks.textContent = toBnNum(totalCurrentMarks);
    if (mobilePaperCount) mobilePaperCount.textContent = toBnNum(qbState.items.length);

    const dropzone = document.getElementById('qb-paper-dropzone');
    if (!dropzone) return;

    if (qbState.items.length === 0) {
      dropzone.innerHTML = `
        <div class="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 sm:p-10 text-center my-4">
          <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-3 text-xl">
            <i class="fa-solid fa-file-circle-Check"></i>
          </div>
          <h4 class="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            প্রশ্নপত্র বর্তমানে খালি আছে
          </h4>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
            উপরের বার থেকে <strong>“প্রশ্ন তৈরি করুন”</strong> বা <strong>“ট্রেড-৪ (৬০ নম্বর) কমন সেট”</strong> বাটনে ক্লিক করুন, অথবা বাম পাশের সাজেশন পুল থেকে যেকোনো প্রশ্নে ক্লিক/ডাবল-ক্লিক করে যোগ করুন।
          </p>
          <button
            type="button"
            id="qb-empty-generate-btn"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md"
          >
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>এখনই ৬০ নম্বরের টেস্ট প্রশ্নপত্র তৈরি করুন</span>
          </button>
        </div>
      `;
      const emptyGenBtn = document.getElementById('qb-empty-generate-btn');
      if (emptyGenBtn) {
        emptyGenBtn.addEventListener('click', () => autoGenerateExamPaper(false));
      }
      return;
    }

    dropzone.innerHTML = qbState.items.map((item, idx) => {
      const prevType = idx > 0 ? qbState.items[idx - 1].base_type : null;
      const showSecBanner = qbState.qType === 'mixed_board' && item.base_type !== prevType;
      const secBannerTitle = showSecBanner ? getSectionHeaderForMixedBoard(item.base_type) : '';
      const secBannerHtml = secBannerTitle
        ? `<div class="mt-4 mb-2 py-1.5 text-center font-extrabold text-sm sm:text-base text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-300 dark:border-slate-700">
            ${escapeHtml(secBannerTitle)}
          </div>`
        : '';

      const isEditing = qbState.editingItemId === item.uid;
      const boardTagHtml = (qbState.showBoardTags && item.board_years && item.board_years.length > 0)
        ? `<span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 ml-1">[${formatBoardYearsText(item.board_years)}]</span>`
        : '';

      // Find if source question has alternate variants so user can double-click to swap as a single question
      const sourceQ = item.sourceId ? state.questions.find(q => q.id === item.sourceId) : null;
      const variantOptions = [];
      if (sourceQ) {
        if (sourceQ.question !== item.question) {
          variantOptions.push(sourceQ.question);
        }
        (sourceQ.alternatives || []).forEach(alt => {
          if (alt.text && alt.text !== item.question) {
            variantOptions.push(alt.text);
          }
        });
      }

      if (isEditing) {
        return `
          ${secBannerHtml}
          <div
            data-paper-uid="${item.uid}"
            data-paper-idx="${idx}"
            class="qb-paper-item bg-indigo-50/60 dark:bg-slate-800 rounded-xl p-3.5 border-2 border-indigo-500 space-y-2.5"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                প্রশ্ন ${toBnNum(idx + 1)} এডিট করুন
              </span>
              <div class="flex items-center gap-1.5">
                <label class="text-xs font-bold text-slate-600 dark:text-slate-300">মান:</label>
                <input
                  type="number"
                  id="qb-edit-marks-${item.uid}"
                  min="1"
                  max="50"
                  value="${item.marks}"
                  class="w-16 px-2 py-1 rounded-lg bg-slate-900 text-white border border-slate-700 text-xs font-bold text-center"
                />
              </div>
            </div>
            <div>
              <textarea
                id="qb-edit-q-${item.uid}"
                rows="2"
                class="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm sm:text-base font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >${escapeHtml(item.question)}</textarea>
            </div>
            <div class="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                data-cancel-edit="${item.uid}"
                class="qb-cancel-edit-btn px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                type="button"
                data-save-edit="${item.uid}"
                class="qb-save-edit-btn px-3.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                <i class="fa-solid fa-check mr-1"></i>সংরক্ষণ করুন
              </button>
            </div>
          </div>
        `;
      }

      return `
        ${secBannerHtml}
        <div
          data-paper-uid="${item.uid}"
          data-paper-idx="${idx}"
          class="qb-paper-item group relative bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-200/80 dark:border-slate-700/70 hover:border-indigo-400 dark:hover:border-indigo-500/70 transition-all"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="text-base sm:text-[17px] font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                <span class="font-bold mr-1">${toBnNum(idx + 1)}।</span>
                <span data-edit-trigger="${item.uid}" class="qb-edit-item-btn cursor-pointer hover:underline decoration-dashed" title="ক্লিক করে প্রশ্নটি এডিট করুন">${escapeHtml(item.question)}</span>
                ${boardTagHtml}
              </div>
              ${
                variantOptions.length > 0
                  ? `<div class="mt-1 flex flex-wrap items-center gap-1.5">
                      ${variantOptions.map(vText => `
                        <span
                          data-swap-variant-uid="${item.uid}"
                          data-swap-variant-text="${escapeHtml(vText)}"
                          class="qb-variant-chip cursor-pointer inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-[11px] font-medium text-indigo-600 dark:text-indigo-300 select-none"
                          title="ডাবল-ক্লিক করলে এই বিকল্প প্রশ্নটি একক প্রশ্ন হিসেবে বসবে"
                        >
                          <i class="fa-solid fa-repeat text-[10px]"></i>
                          <span>অথবা (ডাবল-ক্লিক): ${escapeHtml(vText)}</span>
                        </span>
                      `).join('')}
                    </div>`
                  : ''
              }
            </div>

            <!-- Action Controls -->
            <div class="flex items-center gap-1 shrink-0 opacity-85 group-hover:opacity-100">
              <button
                type="button"
                data-edit-trigger="${item.uid}"
                class="qb-edit-item-btn w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 hover:bg-indigo-600 hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs transition-colors"
                title="প্রশ্নটি এডিট করুন"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button
                type="button"
                data-swap-uid="${item.uid}"
                class="qb-swap-item-btn w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 hover:bg-amber-500 hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs transition-colors"
                title="সাজেশন থেকে অন্য একটি প্রশ্ন দিয়ে এটি বদলান"
              >
                <i class="fa-solid fa-arrows-rotate"></i>
              </button>
              <button
                type="button"
                data-move-up="${idx}"
                class="qb-move-up-btn w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 hover:bg-slate-600 hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs transition-colors ${idx === 0 ? 'opacity-30 pointer-events-none' : ''}"
                title="উপরে নিন"
              >
                <i class="fa-solid fa-arrow-up"></i>
              </button>
              <button
                type="button"
                data-move-down="${idx}"
                class="qb-move-down-btn w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 hover:bg-slate-600 hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs transition-colors ${idx === qbState.items.length - 1 ? 'opacity-30 pointer-events-none' : ''}"
                title="নিচে নামান"
              >
                <i class="fa-solid fa-arrow-down"></i>
              </button>
              <button
                type="button"
                data-delete-uid="${item.uid}"
                class="qb-delete-item-btn w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white flex items-center justify-center text-xs transition-colors"
                title="প্রশ্নটি মুছে ফেলুন"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    bindQbPaperEvents(dropzone);
  }

  function bindQbPaperEvents(dropzone) {
    // 1. Open inline edit
    dropzone.querySelectorAll('.qb-edit-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        qbState.editingItemId = btn.getAttribute('data-edit-trigger');
        renderQbPaper();
      });
    });

    // 2. Cancel inline edit
    dropzone.querySelectorAll('.qb-cancel-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        qbState.editingItemId = null;
        renderQbPaper();
      });
    });

    // 3. Save inline edit
    dropzone.querySelectorAll('.qb-save-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-save-edit');
        const item = qbState.items.find(i => i.uid === uid);
        if (item) {
          const qVal = document.getElementById(`qb-edit-q-${uid}`)?.value.trim();
          const mVal = parseInt(document.getElementById(`qb-edit-marks-${uid}`)?.value, 10);
          if (qVal) item.question = qVal;
          if (mVal > 0) item.marks = mVal;
        }
        qbState.editingItemId = null;
        saveQbStateToStorage();
        renderQbAll();
        showToast('প্রশ্নটি সফলভাবে আপডেট করা হয়েছে!');
      });
    });

    // 4. Double-click (or click) on Alternate variant chip inside paper -> replaces question text as single question!
    dropzone.querySelectorAll('.qb-variant-chip').forEach(chip => {
      const swapToVariant = () => {
        const uid = chip.getAttribute('data-swap-variant-uid');
        const newText = chip.getAttribute('data-swap-variant-text');
        const item = qbState.items.find(i => i.uid === uid);
        if (item && newText) {
          item.question = newText;
          saveQbStateToStorage();
          renderQbPaper();
          showToast('বিকল্প প্রশ্নটি মূল একক প্রশ্ন হিসেবে বসানো হয়েছে!');
        }
      };
      chip.addEventListener('dblclick', swapToVariant);
      chip.addEventListener('click', swapToVariant);
    });

    // 5. Swap with another suggested question of the same type
    dropzone.querySelectorAll('.qb-swap-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-swap-uid');
        const idx = qbState.items.findIndex(i => i.uid === uid);
        if (idx === -1) return;
        const currentItem = qbState.items[idx];
        const usedIds = new Set(qbState.items.map(i => i.sourceId));
        const pool = state.questions.filter(q =>
          !usedIds.has(q.id) &&
          (qbState.tradeId === 'all' || q.trade_id === currentItem.trade_id) &&
          q.base_type === currentItem.base_type &&
          (qbState.chapterKey === 'all' || `${q.trade_id}::${q.chapter}` === qbState.chapterKey || q.chapter === currentItem.chapter)
        );
        if (pool.length === 0) {
          showToast('এই অধ্যায়ে একই ধরনের আর কোনো অব্যবহৃত প্রশ্ন নেই');
          return;
        }
        const randomReplacement = pool[Math.floor(Math.random() * Math.min(pool.length, 6))];
        const newItem = createPaperItemFromQuestion(randomReplacement, currentItem.marks);
        qbState.items[idx] = newItem;
        saveQbStateToStorage();
        renderQbAll();
        renderAll();
        showToast(`প্রশ্ন ${toBnNum(idx + 1)} নতুন প্রশ্ন দিয়ে পরিবর্তন করা হয়েছে!`);
      });
    });

    // 6. Move Up / Move Down / Delete
    dropzone.querySelectorAll('.qb-move-up-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-move-up'), 10);
        if (idx > 0) {
          const temp = qbState.items[idx - 1];
          qbState.items[idx - 1] = qbState.items[idx];
          qbState.items[idx] = temp;
          saveQbStateToStorage();
          renderQbPaper();
        }
      });
    });

    dropzone.querySelectorAll('.qb-move-down-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-move-down'), 10);
        if (idx < qbState.items.length - 1) {
          const temp = qbState.items[idx + 1];
          qbState.items[idx + 1] = qbState.items[idx];
          qbState.items[idx] = temp;
          saveQbStateToStorage();
          renderQbPaper();
        }
      });
    });

    dropzone.querySelectorAll('.qb-delete-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-delete-uid');
        qbState.items = qbState.items.filter(i => i.uid !== uid);
        saveQbStateToStorage();
        renderQbAll();
        renderAll();
      });
    });
  }

  function renderQbAll() {
    renderQbChapterOptions();
    renderQbPool();
    renderQbPaper();
  }

  // Format Exam Paper for Print / PDF (Exact Trade-3.pdf visual layout!)
  function buildPrintableExamPaperHtml() {
    syncQbInputsToState();
    const totalCurrentMarks = getEffectivePaperMarks();

    return `
      <div class="text-black bg-white" style="font-family: 'Kalpurush', sans-serif; line-height: 1.6;">
        <div class="text-center mb-4">
          <h1 class="text-2xl font-bold">${escapeHtml(qbState.institution)}</h1>
          <h2 class="text-lg font-medium mt-0.5">${escapeHtml(qbState.examName)}</h2>
          <p class="text-base font-medium mt-0.5">${escapeHtml(qbState.subjectLine)}</p>
          <div class="flex items-center justify-between mt-2 text-base font-bold">
            <span>সময়: ${escapeHtml(qbState.examTime)}</span>
            <span>পূর্ণমান: ${toBnNum(totalCurrentMarks || qbState.targetMarks)}</span>
          </div>
          ${qbState.instruction ? `<p class="text-base mt-1">${escapeHtml(qbState.instruction)}</p>` : ''}
        </div>

        <div class="space-y-1.5">
          ${qbState.items.map((item, idx) => {
            const prevType = idx > 0 ? qbState.items[idx - 1].base_type : null;
            const showSecBanner = qbState.qType === 'mixed_board' && item.base_type !== prevType;
            const secBannerTitle = showSecBanner ? getSectionHeaderForMixedBoard(item.base_type) : '';
            const secHtml = secBannerTitle
              ? `<div class="pt-4 pb-1 text-center font-normal text-base">${escapeHtml(secBannerTitle)}</div>`
              : '';
            const bTag = (qbState.showBoardTags && item.board_years && item.board_years.length > 0)
              ? ` <span class="text-xs font-normal">[${formatBoardYearsText(item.board_years)}]</span>`
              : '';
            return `
              ${secHtml}
              <div class="py-0.5 text-base" style="break-inside: avoid;">
                ${toBnNum(idx + 1)}। ${escapeHtml(item.question)}${bTag}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function formatExamPaperAsText() {
    syncQbInputsToState();
    const totalCurrentMarks = getEffectivePaperMarks();

    const lines = [
      qbState.institution,
      qbState.examName,
      qbState.subjectLine,
      `সময়: ${qbState.examTime}\t\t\t\tপূর্ণমান: ${toBnNum(totalCurrentMarks || qbState.targetMarks)}`,
      qbState.instruction,
      ''
    ];

    qbState.items.forEach((item, idx) => {
      const prevType = idx > 0 ? qbState.items[idx - 1].base_type : null;
      if (qbState.qType === 'mixed_board' && item.base_type !== prevType) {
        const secTitle = getSectionHeaderForMixedBoard(item.base_type);
        if (secTitle) {
          lines.push('');
          lines.push(secTitle);
        }
      }
      const bTag = (qbState.showBoardTags && item.board_years && item.board_years.length > 0)
        ? ` [${formatBoardYearsText(item.board_years)}]`
        : '';
      lines.push(`${toBnNum(idx + 1)}। ${item.question}${bTag}`);
    });

    return lines.join('\n');
  }

  // Curated Trade-4 (IoT Basics-4) 60-Mark Test Exam-2026 Question Paper (Exact Trade-3.pdf Pattern: 20 + 12 + 6 = 38 Single Questions)
  function loadTrade4Common60Paper() {
    const curatedSpecs = [
      // ক-বিভাগ (মান: ১ x ২০ = ২০) — ২০টি অতি সংক্ষিপ্ত প্রশ্ন (১ মান)
      { id: 'q-327', marks: 1 }, // ১। প্রোগ্রামিং বলতে কী বুঝায়? [বাকাশিবো-২০২৬]
      { id: 'q-292', marks: 1 }, // ২। সুডোকোড বলতে কী বুঝায়? [বাকাশিবো-২০২০, ২১, ২৬]
      { id: 'q-295', marks: 1 }, // ৩। অপারেন্ড কাকে বলে? [বাকাশিবো-২০২০, ২১, ২৫]
      { id: 'q-298', marks: 1 }, // ৪। পাইথন কী? [বাকাশিবো-২০২০, ২১, ২৫]
      { id: 'q-330', marks: 1 }, // ৫। ডাটা টাইপ বলতে কী বুঝায়? [বাকাশিবো-২০২৪, ২৬]
      { id: 'q-308', marks: 1 }, // ৬। কীওয়ার্ড (Keyword) কী? [বাকাশিবো-২০২৪, ২৬]
      { id: 'q-309', marks: 1 }, // ৭। অপারেটর কী? [বাকাশিবো-২০২৪, ২৬]
      { id: 'q-311', marks: 1 }, // ৮। লুপ স্টেটমেন্ট (Loop Statement) কখন ব্যবহার হয়? [বাকাশিবো-২০২৪, ২৬]
      { id: 'q-331', marks: 1 }, // ৯। পাইথনে append() মেথডের কাজ কী? [বাকাশিবো-২০২৪, ২৬]
      { id: 'q-339', marks: 1 }, // ১০। ফ্লোচার্ট বলতে কী বুঝায়? [বাকাশিবো-২০২৬]
      { id: 'q-350', marks: 1, text: 'বিল্ট-ইন ফাংশন কী?' }, // ১১। বিল্ট-ইন ফাংশন কী? [বাকাশিবো-২০২৬]
      { id: 'q-397', marks: 1 }, // ১২। মাইক্রোকন্ট্রোলার কী? [বাকাশিবো-২০২৪, ২৬]
      { id: 'q-382', marks: 1 }, // ১৩। এমবেডেড সিস্টেম কাকে বলে? [বাকাশিবো-২০২৪]
      { id: 'q-379', marks: 1 }, // ১৪। ইন্টারাপ্ট কন্ট্রোল লজিক কী? [বাকাশিবো-২০২৬]
      { id: 'q-428', marks: 1, text: 'আইওটি বলতে কী বুঝায়?' }, // ১৫। আইওটি বলতে কী বুঝায়? [বাকাশিবো-২০২৬]
      { id: 'q-433', marks: 1 }, // ১৬। শিল্পবিপ্লব বলতে কী বুঝায়? [বাকাশিবো-২০২৪, ২৫]
      { id: 'q-443', marks: 1 }, // ১৭। সাইবার সিকিউরিটি কাকে বলে? [বাকাশিবো-২০২৪, ২৫]
      { id: 'q-476', marks: 1 }, // ১৮। ক্লাউড কম্পিউটিং কী? [বাকাশিবো-২০২৪, ২৬]
      { id: 'q-503', marks: 1, text: 'IoT তে ব্যবহৃত তিনটি প্রটোকলের নাম লেখ।' }, // ১৯। IoT তে ব্যবহৃত তিনটি প্রটোকলের নাম লেখ। [বাকাশিবো-২০২৬]
      { id: 'q-516', marks: 1 }, // ২০। সিমুলেশন কী? [বাকাশিবো-২০২৬]

      // খ-বিভাগ (মান: ২ x ১০ = ২০) — ১২টি সংক্ষিপ্ত প্রশ্ন (২ মান, যেকোনো ১০টির উত্তর দিতে হবে)
      { id: 'q-335', marks: 2, text: 'মেশিন ভাষার সুবিধা লেখ।' }, // ২১। মেশিন ভাষার সুবিধা লেখ। [বাকাশিবো-২০২৬]
      { id: 'q-344', marks: 2, text: 'ফাংশনের প্রয়োজনীয়তা লেখ।' }, // ২২। ফাংশনের প্রয়োজনীয়তা লেখ। [বাকাশিবো-২০২৪, ২৬]
      { id: 'q-345', marks: 2, text: 'For লুপের স্ট্রাকচার লেখ।' }, // ২৩। For লুপের স্ট্রাকচার লেখ। [বাকাশিবো-২০২৬]
      { id: 'q-375', marks: 2, text: 'প্রসেসিং ক্যাপাসিটি অনুযায়ী মাইক্রোকন্ট্রোলার কত প্রকার ও কী কী?' }, // ২৪। প্রসেসিং ক্যাপাসিটি অনুযায়ী মাইক্রোকন্ট্রোলার কত প্রকার ও কী কী? [বাকাশিবো-২০২৬]
      { id: 'q-399', marks: 2 }, // ২৫। মাইক্রোকন্ট্রোলারে VCC এবং GND পিনের কাজ কী? [বাকাশিবো-২০২৬]
      { id: 'q-402', marks: 2 }, // ২৬। প্রোগ্রামার টুলস কী? [বাকাশিবো-২০২৪, ২৫]
      { id: 'q-403', marks: 2 }, // ২৭। সেভেন সেগমেন্ট ডিসপ্লে-এর গঠন দেখাও। [বাকাশিবো-২০২৪, ২৫]
      { id: 'q-410', marks: 2 }, // ২৮। এমবেডেড সিস্টেমের সুবিধা লেখ। [বাকাশিবো-২০২৪, ২৫]
      { id: 'q-466', marks: 2 }, // ২৯। চতুর্থ শিল্পবিপ্লবের সাথে তৃতীয় শিল্পবিপ্লবের পার্থক্য কী? [বাকাশিবো-২০২৬]
      { id: 'q-471', marks: 2 }, // ৩০। বাসাবাড়িতে ব্যবহৃত কয়েকটি স্মার্ট ডিভাইসের তালিকা কর। [বাকাশিবো-২০২৫, ২৬]
      { id: 'q-530', marks: 2 }, // ৩১। আইওটি এবং সেন্সরের মধ্যে পার্থক্য কী? [বাকাশিবো-২০২৪, ২৬]
      { id: 'q-532', marks: 2 }, // ৩২। আরডুইনোর ব্যবহার লেখ। [বাকাশিবো-২০২৪, ২৬]

      // গ-বিভাগ (মান: ৪ x ৫ = ২০) — ৬টি রচনামূলক প্রশ্ন (৪ মান, যেকোনো ৫টির উত্তর দিতে হবে)
      { id: 'q-361', marks: 4, text: 'প্রোগ্রাম তৈরির ধাপসমূহ বর্ণনা কর।' }, // ৩৩। প্রোগ্রাম তৈরির ধাপসমূহ বর্ণনা কর। [বাকাশিবো-২০১৯, ২২, ২৪, ২৬]
      { id: 'q-358', marks: 4 }, // ৩৪। লিস্ট কী? লিস্টের বেসিক মেথডগুলোর বর্ণনা কর। [বাকাশিবো-২০২৫, ২৬]
      { id: 'q-420', marks: 4, text: 'এম্বেডেড সিস্টেমের কাজ বর্ণনা কর।' }, // ৩৫। এম্বেডেড সিস্টেমের কাজ বর্ণনা কর। [বাকাশিবো-২০২৬]
      { id: 'q-495', marks: 4 }, // ৩৬। আইওটি মৌলিক উপাদানসমূহ কী কী? বর্ণনা কর। [বাকাশিবো-২০২৪, ২৬]
      { id: 'q-544', marks: 4, text: 'চারটি বহুল ব্যবহৃত সেন্সরের কাজ বর্ণনা কর।' }, // ৩৭। চারটি বহুল ব্যবহৃত সেন্সরের কাজ বর্ণনা কর। [বাকাশিবো-২০২৪, ২৬]
      { id: 'q-540', marks: 4 }  // ৩৮। আইওটি সিস্টেমের কয়েকটি প্রটোকলের নাম ও কাজ বর্ণনা কর। [বাকাশিবো-২০২৬]
    ];

    qbState.tradeId = 'trade-4';
    qbState.chapterKey = 'all';
    qbState.qType = 'mixed_board';
    qbState.targetMarks = 60;
    qbState.institution = 'সফির উদ্দিন হাই স্কুল এন্ড কলেজ';
    qbState.examName = 'দশম (ভোকেশনাল) শ্রেণি টেস্ট পরীক্ষা-২০২৬';
    qbState.subjectLine = 'বিষয়: আইটি সাপোর্ট এন্ড আইওটি বেসিকস-৪ (Trade-4)';
    qbState.customSubjectEdited = false;
    qbState.examTime = '৩ ঘন্টা';
    qbState.instruction = '[দ্রষ্টব্য: ক-বিভাগের সকল, খ-বিভাগের যে কোন ১০টি এবং গ-বিভাগের যে কোন ৫টি প্রশ্নের উত্তর দাও]';

    renderQbChapterOptions();
    const chEl = document.getElementById('qb-chapter-select');
    if (chEl) chEl.value = 'all';
    syncStateToQbHeaderInputs();

    const items = [];
    curatedSpecs.forEach(spec => {
      const q = state.questions.find(item => item.id === spec.id);
      if (q) {
        items.push(createPaperItemFromQuestion(q, spec.marks, spec.text));
      }
    });

    qbState.items = items;
    saveQbStateToStorage();
    renderQbAll();
    renderAll();
    showToast('ট্রেড-৪ এর ৬০ নম্বরের টেস্ট পরীক্ষা-২০২৬ প্রশ্নপত্র লোড করা হয়েছে!');
  }

  function switchQbMobileTab(tabName) {
    qbState.mobileTab = tabName === 'pool' ? 'pool' : 'paper';
    saveQbStateToStorage();
    const poolPane = document.getElementById('qb-left-pool-pane');
    const paperPane = document.getElementById('qb-right-paper-pane');
    document.querySelectorAll('.qb-mobile-tab').forEach(btn => {
      const t = btn.getAttribute('data-qb-tab');
      const active = t === qbState.mobileTab;
      btn.className = `qb-mobile-tab flex-1 py-2.5 text-xs font-bold border-b-2 ${
        active
          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
          : 'border-transparent text-slate-500 dark:text-slate-400'
      }`;
    });
    if (poolPane && paperPane) {
      if (qbState.mobileTab === 'pool') {
        poolPane.classList.remove('hidden');
        poolPane.classList.add('flex');
        paperPane.classList.add('hidden');
        paperPane.classList.remove('flex');
      } else {
        paperPane.classList.remove('hidden');
        paperPane.classList.add('flex');
        poolPane.classList.add('hidden');
        poolPane.classList.remove('flex');
      }
    }
  }

  function initQuestionBuilder() {
    loadQbStateFromStorage();
    switchQbMobileTab(qbState.mobileTab || 'paper');

    const openBtn = document.getElementById('open-question-builder-btn');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        // If paper is empty on first open, load the default Trade-4 60-mark Test Exam-2026 paper!
        if (qbState.items.length === 0) {
          loadTrade4Common60Paper();
        } else {
          renderQbAll();
        }
        switchQbMobileTab(qbState.mobileTab || 'paper');
        openModal('question-builder-modal');
      });
    }

    // Trade / Chapter / Type change events
    const tradeSelect = document.getElementById('qb-trade-select');
    if (tradeSelect) {
      tradeSelect.addEventListener('change', (e) => {
        qbState.tradeId = e.target.value;
        qbState.chapterKey = 'all';
        qbState.customSubjectEdited = false;
        qbState.subjectLine = getDefaultSubjectLineForTrade(qbState.tradeId, qbState.chapterKey);
        saveQbStateToStorage();
        renderQbAll();
      });
    }

    const chSelect = document.getElementById('qb-chapter-select');
    if (chSelect) {
      chSelect.addEventListener('change', (e) => {
        qbState.chapterKey = e.target.value;
        if (!qbState.customSubjectEdited) {
          qbState.subjectLine = getDefaultSubjectLineForTrade(qbState.tradeId, qbState.chapterKey);
        }
        saveQbStateToStorage();
        renderQbPool();
        renderQbPaper();
      });
    }

    const typeSelect = document.getElementById('qb-type-select');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        qbState.qType = e.target.value;
        saveQbStateToStorage();
        renderQbPool();
        renderQbPaper();
      });
    }

    // Live Header Inputs (directly inside the preview question paper + target marks)
    ['qb-total-marks-input', 'qb-institution-input', 'qb-exam-name-input', 'qb-subject-line-input', 'qb-exam-time-input', 'qb-instruction-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          if (id === 'qb-subject-line-input') {
            qbState.customSubjectEdited = true;
          }
          syncQbInputsToState();
          saveQbStateToStorage();
          const marksEl = document.getElementById('qb-paper-marks-display');
          const statTargetMarks = document.getElementById('qb-stat-target-marks');
          if (marksEl) marksEl.textContent = toBnNum(getEffectivePaperMarks() || qbState.targetMarks);
          if (statTargetMarks) statTargetMarks.textContent = toBnNum(qbState.targetMarks);
        });
      }
    });

    const showBoardCheckbox = document.getElementById('qb-show-board-tags');
    if (showBoardCheckbox) {
      showBoardCheckbox.checked = qbState.showBoardTags;
      showBoardCheckbox.addEventListener('change', () => {
        qbState.showBoardTags = showBoardCheckbox.checked;
        saveQbStateToStorage();
        renderQbPaper();
      });
    }

    // Generate & Append buttons
    const genBtn = document.getElementById('qb-generate-btn');
    if (genBtn) {
      genBtn.addEventListener('click', () => autoGenerateExamPaper(false));
    }

    const appendBtn = document.getElementById('qb-append-btn');
    if (appendBtn) {
      appendBtn.addEventListener('click', () => autoGenerateExamPaper(true));
    }

    // 1-Click Curated Trade-4 (60 Marks) Common Test Question Set Button
    const loadT4CommonBtn = document.getElementById('qb-load-t4-60-btn');
    if (loadT4CommonBtn) {
      loadT4CommonBtn.addEventListener('click', () => loadTrade4Common60Paper());
    }

    // Pool Search & Priority Filter
    const poolSearch = document.getElementById('qb-pool-search');
    if (poolSearch) {
      poolSearch.addEventListener('input', (e) => {
        qbState.poolSearch = e.target.value;
        saveQbStateToStorage();
        renderQbPool();
      });
    }

    const poolPriority = document.getElementById('qb-pool-filter-priority');
    if (poolPriority) {
      poolPriority.addEventListener('change', (e) => {
        qbState.poolPriority = e.target.value;
        saveQbStateToStorage();
        renderQbPool();
      });
    }

    // Mobile Tabs inside Studio
    document.querySelectorAll('.qb-mobile-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        switchQbMobileTab(btn.getAttribute('data-qb-tab'));
      });
    });

    // Add Custom Blank Question button
    const addCustomBtn = document.getElementById('qb-add-custom-q-btn');
    if (addCustomBtn) {
      addCustomBtn.addEventListener('click', () => {
        const defaultMark = getDefaultMarkForType(qbState.qType === 'all' || qbState.qType === 'mixed_board' ? 'short' : qbState.qType);
        const newItem = {
          uid: `pitem-${Date.now()}`,
          sourceId: null,
          question: 'নতুন প্রশ্ন এখানে লিখুন...',
          marks: defaultMark,
          base_type: 'short',
          board_years: [],
          chapter: '',
          trade_id: qbState.tradeId
        };
        qbState.items.push(newItem);
        qbState.editingItemId = newItem.uid;
        saveQbStateToStorage();
        renderQbPaper();
      });
    }

    // Shuffle Paper Questions
    const shuffleBtn = document.getElementById('qb-shuffle-paper-btn');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
        for (let i = qbState.items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [qbState.items[i], qbState.items[j]] = [qbState.items[j], qbState.items[i]];
        }
        saveQbStateToStorage();
        renderQbPaper();
        showToast('প্রশ্নপত্রের ক্রম শাফল (এলোমেলো) করা হয়েছে');
      });
    }

    // Clear Paper
    const clearBtn = document.getElementById('qb-clear-paper-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        qbState.items = [];
        qbState.editingItemId = null;
        saveQbStateToStorage();
        renderQbAll();
        renderAll();
        showToast('প্রশ্নপত্র খালি করা হয়েছে');
      });
    }

    // Copy Formatted Exam Paper for MS Word
    const copyPaperBtn = document.getElementById('qb-copy-paper-btn');
    if (copyPaperBtn) {
      copyPaperBtn.addEventListener('click', () => {
        if (qbState.items.length === 0) {
          showToast('কপি করার জন্য অন্তত একটি প্রশ্ন যুক্ত করুন');
          return;
        }
        const txt = formatExamPaperAsText();
        navigator.clipboard.writeText(txt).then(() => {
          showToast('পূর্ণাঙ্গ প্রশ্নপত্রটি ক্লিপবোর্ডে কপি করা হয়েছে (MS Word-এ পেস্ট করার উপযোগী)!');
        });
      });
    }

    // Print / PDF Exam Paper
    const printPaperBtn = document.getElementById('qb-print-paper-btn');
    if (printPaperBtn) {
      printPaperBtn.addEventListener('click', () => {
        if (qbState.items.length === 0) {
          showToast('প্রিন্ট করার জন্য অন্তত একটি প্রশ্ন যুক্ত করুন');
          return;
        }
        const sheetEl = document.getElementById('exam-paper-print-sheet');
        if (sheetEl) {
          sheetEl.innerHTML = buildPrintableExamPaperHtml();
        }
        document.body.classList.add('printing-exam-paper');
        window.print();
        setTimeout(() => {
          document.body.classList.remove('printing-exam-paper');
        }, 500);
      });
    }
  }

  // PWA Service Worker & Long-Duration Launch Install Toast
  let deferredInstallPrompt = null;
  let installToastTimer = null;
  let isInstallToastVisible = false;

  function isRunningStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: window-controls-overlay)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  function showPwaInstallToast(durationMs = 30000) {
    if (isRunningStandalone() || !deferredInstallPrompt) return;
    const toastEl = document.getElementById('pwa-install-toast');
    const progressEl = document.getElementById('pwa-install-progress');
    if (!toastEl) return;

    isInstallToastVisible = true;
    toastEl.classList.remove('translate-y-28', 'opacity-0', 'pointer-events-none');
    toastEl.classList.add('translate-y-0', 'opacity-100');

    if (progressEl) {
      progressEl.style.transition = 'none';
      progressEl.style.width = '100%';
      void progressEl.offsetWidth;
      progressEl.style.transition = `width ${durationMs}ms linear`;
      progressEl.style.width = '0%';
    }

    if (installToastTimer) clearTimeout(installToastTimer);
    installToastTimer = setTimeout(() => {
      hidePwaInstallToast();
    }, durationMs);
  }

  function hidePwaInstallToast() {
    const toastEl = document.getElementById('pwa-install-toast');
    if (!toastEl) return;
    isInstallToastVisible = false;
    toastEl.classList.add('translate-y-28', 'opacity-0', 'pointer-events-none');
    toastEl.classList.remove('translate-y-0', 'opacity-100');
    if (installToastTimer) {
      clearTimeout(installToastTimer);
      installToastTimer = null;
    }
  }

  async function triggerPwaInstall() {
    if (!deferredInstallPrompt) {
      hidePwaInstallToast();
      return;
    }
    try {
      const promptEvent = deferredInstallPrompt;
      deferredInstallPrompt = null;
      await promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        try { localStorage.setItem('vocai_pwa_installed', 'true'); } catch (e) {}
        hidePwaInstallToast();
        const headerInstallBtn = document.getElementById('header-install-btn');
        if (headerInstallBtn) {
          headerInstallBtn.classList.add('hidden');
          headerInstallBtn.classList.remove('inline-flex');
        }
        showToast('VocAI সফলভাবে ইনস্টল হচ্ছে!');
      } else {
        hidePwaInstallToast();
      }
    } catch (err) {
      console.error('Install prompt error:', err);
      hidePwaInstallToast();
    }
  }

  function initPwaInstallFeature() {
    // 1. Register Service Worker for Chrome PWA Installability
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(err => {
          console.warn('SW registration notice:', err);
        });
      });
    }

    const headerInstallBtn = document.getElementById('header-install-btn');
    const toastInstallBtn = document.getElementById('pwa-toast-install-btn');
    const toastCloseBtn = document.getElementById('pwa-toast-close-btn');
    const toastEl = document.getElementById('pwa-install-toast');
    const progressEl = document.getElementById('pwa-install-progress');

    // Always start with install button & toast hidden until browser confirms app is NOT installed
    if (headerInstallBtn) {
      headerInstallBtn.classList.add('hidden');
      headerInstallBtn.classList.remove('inline-flex');
    }
    if (isRunningStandalone()) {
      try { localStorage.setItem('vocai_pwa_installed', 'true'); } catch (e) {}
      hidePwaInstallToast();
      return;
    }

    // 2. Capture Chrome's beforeinstallprompt event (ONLY fires when PWA is NOT installed)
    window.addEventListener('beforeinstallprompt', async (e) => {
      e.preventDefault();
      if (isRunningStandalone()) return;

      // Double-check via getInstalledRelatedApps if supported
      if ('getInstalledRelatedApps' in navigator) {
        try {
          const relatedApps = await navigator.getInstalledRelatedApps();
          if (relatedApps && relatedApps.length > 0) {
            return;
          }
        } catch (err) {}
      }

      deferredInstallPrompt = e;
      try { localStorage.removeItem('vocai_pwa_installed'); } catch (err) {}

      if (headerInstallBtn) {
        headerInstallBtn.classList.remove('hidden');
        headerInstallBtn.classList.add('inline-flex');
      }

      // Show the long-duration (30s) install toast on launch only if not already visible
      if (!isInstallToastVisible) {
        showPwaInstallToast(30000);
      }
    });

    // 3. Hide install UI immediately once installed
    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      try { localStorage.setItem('vocai_pwa_installed', 'true'); } catch (e) {}
      hidePwaInstallToast();
      if (headerInstallBtn) {
        headerInstallBtn.classList.add('hidden');
        headerInstallBtn.classList.remove('inline-flex');
      }
      showToast('অভিনন্দন! VocAI অ্যাপটি ইনস্টল সম্পন্ন হয়েছে।');
    });

    // 4. Bind button clicks
    if (headerInstallBtn) {
      headerInstallBtn.addEventListener('click', triggerPwaInstall);
    }
    if (toastInstallBtn) {
      toastInstallBtn.addEventListener('click', triggerPwaInstall);
    }
    if (toastCloseBtn) {
      toastCloseBtn.addEventListener('click', hidePwaInstallToast);
    }

    // Pause auto-dismiss timer when user hovers/touches the install toast
    if (toastEl) {
      toastEl.addEventListener('mouseenter', () => {
        if (installToastTimer) {
          clearTimeout(installToastTimer);
          installToastTimer = null;
        }
        if (progressEl) {
          progressEl.style.transition = 'none';
          progressEl.style.width = '100%';
        }
      });
      toastEl.addEventListener('mouseleave', () => {
        if (isInstallToastVisible && deferredInstallPrompt) {
          showPwaInstallToast(20000);
        }
      });
    }
  }

  // Boot application
  document.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    initEvents();
    syncControlInputs();
    renderAll();
  });
})();
