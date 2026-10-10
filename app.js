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
    darkMode: false
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
      if (savedTheme === 'true') {
        state.darkMode = true;
        document.documentElement.classList.add('dark');
      }
    } catch (err) {
      console.error('Storage load error:', err);
      state.questions = [...(window.INITIAL_QUESTIONS_DATA || [])];
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
          if (!q.board_years || (!q.board_years.includes(2025) && !q.board_years.includes(2024))) return false;
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
      board_recent: basePool.filter(q => q.board_years && (q.board_years.includes(2025) || q.board_years.includes(2024))).length,
      starred: basePool.filter(q => state.starredIds.has(q.id)).length
    };

    const presets = [
      { id: 'all', label: 'সকল প্রশ্ন', icon: 'fa-list-check', count: counts.all, color: 'indigo' },
      { id: 'top_important', label: 'অতি গুরুত্বপূর্ণ (★★★)', icon: 'fa-fire', count: counts.top_important, color: 'rose' },
      { id: 'all_important', label: 'গুরুত্বপূর্ণ সাজেশন', icon: 'fa-wand-magic-sparkles', count: counts.all_important, color: 'amber' },
      { id: 'board_all', label: 'সকল বোর্ড প্রশ্ন [বাকাশিবো]', icon: 'fa-building-columns', count: counts.board_all, color: 'emerald' },
      { id: 'board_recent', label: 'বোর্ড ২০২৪ ও ২০২৫', icon: 'fa-calendar-check', count: counts.board_recent, color: 'cyan' },
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
        board_recent: 'বোর্ড ২০২৪ ও ২০২৫',
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
    let line = `${q.q_no_bn}। ${q.question}`;
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
            <span>সালভিত্তিক বাকাশিবো বোর্ড প্রশ্ন (২০১১–২০২৫)</span>
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
    renderHeaderAndTrades();
    renderPresetBar();
    renderTopicChips();
    renderChapterNavigation();
    renderBoardYearDropdown();
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
        hidePwaInstallToast();
      }
    });

    initPwaInstallFeature();
  }

  // PWA Service Worker & Long-Duration Launch Install Toast
  let deferredInstallPrompt = null;
  let installToastTimer = null;

  function isRunningStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }

  function showPwaInstallToast(durationMs = 30000) {
    if (isRunningStandalone()) return;
    const toastEl = document.getElementById('pwa-install-toast');
    const progressEl = document.getElementById('pwa-install-progress');
    if (!toastEl) return;

    toastEl.classList.remove('translate-y-28', 'opacity-0', 'pointer-events-none');
    toastEl.classList.add('translate-y-0', 'opacity-100');

    if (progressEl) {
      progressEl.style.transition = 'none';
      progressEl.style.width = '100%';
      // Trigger reflow then animate width to 0 over durationMs
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
    toastEl.classList.add('translate-y-28', 'opacity-0', 'pointer-events-none');
    toastEl.classList.remove('translate-y-0', 'opacity-100');
    if (installToastTimer) {
      clearTimeout(installToastTimer);
      installToastTimer = null;
    }
  }

  async function triggerPwaInstall() {
    if (deferredInstallPrompt) {
      try {
        deferredInstallPrompt.prompt();
        const choiceResult = await deferredInstallPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          hidePwaInstallToast();
          showToast('Vocational Intelligence সফলভাবে ইনস্টল হচ্ছে!');
        }
        deferredInstallPrompt = null;
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else {
      // Fallback guidance if browser hasn't fired beforeinstallprompt yet
      showToast('ব্রাউজারের ⋮ মেনু বা অ্যাড্রেস বারের ইনস্টল আইকন থেকে "Install app" বা "Add to Home screen"-এ ক্লিক করুন');
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

    if (isRunningStandalone() && headerInstallBtn) {
      headerInstallBtn.classList.add('hidden');
    }

    // 2. Capture Chrome's beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      if (headerInstallBtn) {
        headerInstallBtn.classList.remove('hidden');
        headerInstallBtn.classList.add('inline-flex');
      }
      // Show or refresh the long-duration install toast (30 seconds)
      showPwaInstallToast(30000);
    });

    // 3. Hide install UI once installed
    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      hidePwaInstallToast();
      if (headerInstallBtn) headerInstallBtn.classList.add('hidden');
      showToast('অভিনন্দন! Vocational Intelligence অ্যাপটি ইনস্টল সম্পন্ন হয়েছে।');
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
        showPwaInstallToast(20000);
      });
    }

    // 5. On launch, immediately show the long-duration install toast (30 seconds)
    if (!isRunningStandalone()) {
      setTimeout(() => {
        showPwaInstallToast(30000);
      }, 600);
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
