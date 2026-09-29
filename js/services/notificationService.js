/**
 * VARSHA-RA: Notification & Real-Time Alert Service
 * Manages toast notifications, unread update counts, and the
 * chronological update log panel.
 */

export class NotificationService {
  constructor() {
    this.notifications = [
      {
        id: "NOTIF-001",
        category: "FORECAST",
        title: "Forecast Cycle Updated",
        description: "New 0.05° high-resolution post-processed forecast cycle initialized (14 AUG 2024 • 00:00 UTC).",
        timestamp: "09:42 AM IST",
        read: false,
        status: "ACTIVE"
      },
      {
        id: "NOTIF-002",
        category: "REGIME",
        title: "Monsoon Regime Classification",
        description: "Dominant synoptic regime confirmed as DEPRESSION / LOW (68% confidence) across Central India.",
        timestamp: "09:40 AM IST",
        read: false,
        status: "ACTIVE"
      },
      {
        id: "NOTIF-003",
        category: "RISK",
        title: "Heavy Rainfall Exceedance Alert",
        description: "Western Ghats & Vidarbha core zone exhibits 84% probability of exceeding 50mm threshold.",
        timestamp: "09:35 AM IST",
        read: false,
        status: "WARNING"
      },
      {
        id: "NOTIF-004",
        category: "DISTRICT",
        title: "District Analytics Refreshed",
        description: "Polygon area-weighted statistics recomputed across 18 key monsoon districts.",
        timestamp: "09:30 AM IST",
        read: true,
        status: "SYSTEM"
      },
      {
        id: "NOTIF-005",
        category: "MODEL",
        title: "ATMOS AI Bias Correction",
        description: "Slope-aspect condensation multipliers applied to Western Ghats windward grid cells.",
        timestamp: "09:15 AM IST",
        read: true,
        status: "SYSTEM"
      }
    ];

    this.listeners = [];
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  getNotifications() {
    return this.notifications;
  }

  markAllAsRead() {
    this.notifications.forEach(n => (n.read = true));
    this.notifyListeners();
  }

  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  addNotification(category, title, description, status = "SYSTEM") {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST";
    
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      category,
      title,
      description,
      timestamp: timeStr,
      read: false,
      status
    };

    this.notifications.unshift(newNotif);
    this.showToast(newNotif);
    this.notifyListeners();
  }

  showToast(notif) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.cssText = "position: fixed; top: 84px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 0.5rem; max-width: 380px; pointer-events: none;";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.style.cssText = "background: #ffffff; border: 1px solid #d7e3ee; border-left: 4px solid #1769d1; border-radius: 8px; padding: 0.75rem 1rem; box-shadow: 0 10px 25px rgba(16,42,67,0.12); font-family: var(--font-sans); pointer-events: auto; animation: toastIn 0.3s ease-out;";
    toast.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
        <span style="font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; color: #1769d1; text-transform: uppercase;">${notif.category} UPDATE</span>
        <span style="font-size: 0.7rem; color: #7a8a99;">${notif.timestamp}</span>
      </div>
      <div style="font-size: 0.85rem; font-weight: 700; color: #12304a;">${notif.title}</div>
      <div style="font-size: 0.78rem; color: #52667a; margin-top: 0.15rem;">${notif.description}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.4s ease";
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  subscribe(listener) {
    if (typeof listener === "function") {
      this.listeners.push(listener);
    }
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.notifications, this.getUnreadCount()));
  }
}

export const notificationService = new NotificationService();
