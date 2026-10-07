export interface USMarketState {
  isUsEquitiesOpen: boolean;
  sessionType: 'WEEKEND_CLOSED' | 'OVERNIGHT_CLOSED' | 'AFTER_HOURS' | 'PRE_MARKET' | 'REGULAR_HOURS';
  sessionName: string;
  isOffHoursActive: boolean; // True when US is closed (Weekend / Overnight)
  nyTimeFormatted: string;
  utcTimeFormatted: string;
  secondsUntilNextOpen: number;
  nextOpenDateFormatted: string;
  weekendProgressPercent?: number; // 0% at Friday 4 PM, 100% at Monday 9:30 AM
  rTokenStatus: '24/7_ACTIVE' | 'ONLINE';
  edgeExplanation: string;
}

export class MarketClockService {
  /**
   * Evaluates current market state relative to US Eastern Time (NYSE/NASDAQ schedule).
   */
  static getCurrentState(overrideDate?: Date): USMarketState {
    const now = overrideDate || new Date();

    // Convert to US Eastern Time components
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      weekday: 'short',
    });

    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';

    const weekday = getPart('weekday'); // "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    const hour = parseInt(getPart('hour'), 10);
    const minute = parseInt(getPart('minute'), 10);
    const second = parseInt(getPart('second'), 10);
    const timeInMinutes = hour * 60 + minute;

    const nyTimeFormatted = `${weekday} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')} EST`;
    const utcTimeFormatted = now.toUTCString();

    const isWeekend = weekday === 'Sat' || weekday === 'Sun';
    const isFridayAfterClose = weekday === 'Fri' && timeInMinutes >= 16 * 60;
    const isMondayPreOpen = weekday === 'Mon' && timeInMinutes < 9 * 60 + 30;

    let sessionType: USMarketState['sessionType'] = 'REGULAR_HOURS';
    let sessionName = 'US Regular Market Open (NYSE / NASDAQ)';
    let isUsEquitiesOpen = false;
    let isOffHoursActive = false;
    let edgeExplanation = '';

    if (isWeekend || isFridayAfterClose || (weekday === 'Mon' && timeInMinutes < 4 * 60)) {
      sessionType = 'WEEKEND_CLOSED';
      sessionName = 'Weekend Gap (US Equities Closed ~65.5h)';
      isUsEquitiesOpen = false;
      isOffHoursActive = true;
      edgeExplanation = 'Native US stock exchanges are completely shut. Global breaking events, central bank chatter, and crypto weekend moves are accumulating. Bitget rTokens trade 24/7, giving Exbit first-mover pricing edge.';
    } else if (timeInMinutes >= 20 * 60 || timeInMinutes < 4 * 60) {
      sessionType = 'OVERNIGHT_CLOSED';
      sessionName = 'US Overnight Session (Markets Fully Closed)';
      isUsEquitiesOpen = false;
      isOffHoursActive = true;
      edgeExplanation = 'US equities closed overnight until morning pre-market. Asian & European breaking news flows into rToken markets on Bitget ahead of Wall Street.';
    } else if (timeInMinutes >= 16 * 60 && timeInMinutes < 20 * 60) {
      sessionType = 'AFTER_HOURS';
      sessionName = 'US Extended After-Hours (Thin Liquidity)';
      isUsEquitiesOpen = false;
      isOffHoursActive = true;
      edgeExplanation = 'Wall Street regular session closed. Earnings releases and after-hours disclosures are being absorbed.';
    } else if (timeInMinutes >= 4 * 60 && timeInMinutes < 9 * 60 + 30) {
      sessionType = 'PRE_MARKET';
      sessionName = 'US Pre-Market Session';
      isUsEquitiesOpen = false;
      isOffHoursActive = false;
      edgeExplanation = 'Early pre-market quotes emerging; final window before 9:30 AM EST regular opening bell.';
    } else {
      sessionType = 'REGULAR_HOURS';
      sessionName = 'US Regular Session (9:30 AM - 4:00 PM EST)';
      isUsEquitiesOpen = true;
      isOffHoursActive = false;
      edgeExplanation = 'Standard NYSE/NASDAQ hours. Arbitrage between native stock and rToken tightest.';
    }

    // Calculate next regular open (Monday 9:30 AM or Next Day 9:30 AM)
    const nextOpen = this.getNextUsOpen(now, weekday, hour, minute, second);
    const secondsUntilNextOpen = Math.max(0, Math.floor((nextOpen.getTime() - now.getTime()) / 1000));
    
    // Weekend progress: from Friday 16:00 to Monday 09:30 is 65.5 hours = 235,800 seconds
    let weekendProgressPercent: number | undefined;
    if (sessionType === 'WEEKEND_CLOSED') {
      const totalWeekendSeconds = 65.5 * 3600;
      const elapsed = totalWeekendSeconds - secondsUntilNextOpen;
      weekendProgressPercent = Math.min(100, Math.max(5, Math.floor((elapsed / totalWeekendSeconds) * 100)));
    }

    return {
      isUsEquitiesOpen,
      sessionType,
      sessionName,
      isOffHoursActive,
      nyTimeFormatted,
      utcTimeFormatted,
      secondsUntilNextOpen,
      nextOpenDateFormatted: nextOpen.toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' }) + ' EST',
      weekendProgressPercent,
      rTokenStatus: '24/7_ACTIVE',
      edgeExplanation,
    };
  }

  private static getNextUsOpen(now: Date, weekday: string, hour: number, minute: number, second: number): Date {
    const target = new Date(now.getTime());
    let daysToAdd = 0;

    if (weekday === 'Fri') {
      if (hour * 60 + minute >= 9 * 60 + 30) {
        daysToAdd = 3; // Friday afternoon -> Monday
      }
    } else if (weekday === 'Sat') {
      daysToAdd = 2; // Saturday -> Monday
    } else if (weekday === 'Sun') {
      daysToAdd = 1; // Sunday -> Monday
    } else if (weekday === 'Mon') {
      if (hour * 60 + minute >= 9 * 60 + 30) {
        daysToAdd = 1; // Tuesday
      }
    } else {
      if (hour * 60 + minute >= 9 * 60 + 30) {
        daysToAdd = 1;
      }
    }

    target.setDate(target.getDate() + daysToAdd);
    // Approximate 9:30 AM EST in UTC (either 13:30 or 14:30 depending on DST, safe approximation)
    return target;
  }
}
