/**
 * VARSHA-RA: Notification Modal / Updates Drawer Component
 * Renders the slide-over VARSHA-RA UPDATES panel showing chronological
 * updates, status categories, and mark as read / clear functions.
 */

import { notificationService } from "../services/notificationService.js";

export class NotificationModalComponent {
  constructor() {
    this.isOpen = false;
  }

  init() {
    this.createDrawerDOM();
    this.bindHeaderTrigger();
    notificationService.subscribe((notifs, unreadCount) => {
      this.updateBadgeCount(unreadCount);
      if (this.isOpen) {
        this.renderNotificationsList(notifs);
      }
    });
  }

  createDrawerDOM() {
    if (document.getElementById("updates-drawer-backdrop")) return;

    const backdrop = document.createElement("div");
    backdrop.id = "updates-drawer-backdrop";
    backdrop.style.cssText = "position: fixed; inset: 0; background: rgba(15,39,71,0.35); backdrop-filter: blur(4px); z-index: 9990; display: none; opacity: 0; transition: opacity 0.3s ease;";

    const drawer = document.createElement("div");
    drawer.id = "updates-drawer-panel";
    drawer.style.cssText = "position: fixed; top: 0; right: -420px; width: 100%; max-width: 420px; height: 100vh; background: #ffffff; border-left: 1px solid #d7e3ee; box-shadow: -10px 0 30px rgba(15,39,71,0.15); z-index: 9995; display: flex; flex-direction: column; transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1); font-family: var(--font-sans);";

    drawer.innerHTML = `
      <!-- Drawer Header -->
      <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid #d7e3ee; display: flex; align-items: center; justify-content: space-between; background: #f6faff;">
        <div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #1769d1; font-weight: 700; text-transform: uppercase;">
            SYSTEM UPDATE CHRONICLE
          </div>
          <h3 style="font-size: 1.15rem; color: #12304a; margin-top: 0.15rem;">ATMOS UPDATES</h3>
        </div>
        <button id="close-updates-drawer-btn" style="background: none; border: none; font-size: 1.5rem; color: #52667a; cursor: pointer; line-height: 1; padding: 0.2rem 0.5rem;">
          &times;
        </button>
      </div>

      <!-- Toolbar Actions -->
      <div style="padding: 0.75rem 1.5rem; border-bottom: 1px solid #eaf3ff; display: flex; justify-content: space-between; align-items: center; background: #ffffff;">
        <button id="mark-read-btn" style="background: #eaf4ff; color: #1769d1; border: 1px solid #d7e3ee; border-radius: 6px; padding: 0.35rem 0.75rem; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
          Mark all as read
        </button>
        <button id="clear-notifs-btn" style="background: #ffffff; color: #7a8a99; border: 1px solid #d7e3ee; border-radius: 6px; padding: 0.35rem 0.75rem; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
          Clear notifications
        </button>
      </div>

      <!-- Notifications List Container -->
      <div id="updates-list-container" style="flex: 1; overflow-y: auto; padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 0.85rem;">
        <!-- Populated dynamically -->
      </div>

      <!-- Footer Info -->
      <div style="padding: 0.85rem 1.5rem; border-top: 1px solid #d7e3ee; background: #f6faff; font-size: 0.75rem; color: #7a8a99; font-family: var(--font-mono); text-align: center;">
        ATMOS v2.4 • REAL-TIME MODEL STREAM
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    // Bind drawer internal buttons
    document.getElementById("close-updates-drawer-btn")?.addEventListener("click", () => this.close());
    backdrop.addEventListener("click", () => this.close());
    document.getElementById("mark-read-btn")?.addEventListener("click", () => {
      notificationService.markAllAsRead();
    });
    document.getElementById("clear-notifs-btn")?.addEventListener("click", () => {
      notificationService.clearAll();
    });
  }

  bindHeaderTrigger() {
    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest("#header-updates-btn");
      if (btn) {
        this.open();
      }
    });
  }

  open() {
    this.isOpen = true;
    const backdrop = document.getElementById("updates-drawer-backdrop");
    const panel = document.getElementById("updates-drawer-panel");

    if (backdrop && panel) {
      backdrop.style.display = "block";
      setTimeout(() => (backdrop.style.opacity = "1"), 10);
      panel.style.right = "0";
    }

    notificationService.markAllAsRead();
    this.renderNotificationsList(notificationService.getNotifications());
  }

  close() {
    this.isOpen = false;
    const backdrop = document.getElementById("updates-drawer-backdrop");
    const panel = document.getElementById("updates-drawer-panel");

    if (backdrop && panel) {
      backdrop.style.opacity = "0";
      panel.style.right = "-420px";
      setTimeout(() => (backdrop.style.display = "none"), 350);
    }
  }

  updateBadgeCount(count) {
    const badge = document.getElementById("updates-count-badge");
    if (badge) {
      badge.innerText = count;
      badge.style.display = count > 0 ? "inline-block" : "none";
    }
  }

  renderNotificationsList(notifs) {
    const container = document.getElementById("updates-list-container");
    if (!container) return;

    if (!notifs || notifs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: #7a8a99;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔔</div>
          <div style="font-size: 0.9rem; font-weight: 600;">No active updates</div>
          <div style="font-size: 0.78rem; margin-top: 0.2rem;">All weather and model notifications cleared.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = notifs.map(n => {
      const categoryColors = {
        FORECAST: "#1769d1",
        REGIME: "#168a62",
        RISK: "#d64545",
        DISTRICT: "#d99000",
        MODEL: "#7c3aed",
        WEATHER: "#0284c7"
      };
      const borderCol = categoryColors[n.category] || "#1769d1";

      return `
        <div style="background: ${n.read ? "#ffffff" : "#f6faff"}; border: 1px solid #d7e3ee; border-left: 4px solid ${borderCol}; border-radius: 8px; padding: 0.85rem 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
            <span style="font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; color: ${borderCol}; text-transform: uppercase;">
              ${n.category}
            </span>
            <span style="font-size: 0.7rem; color: #7a8a99; font-family: var(--font-mono);">${n.timestamp}</span>
          </div>
          <div style="font-size: 0.88rem; font-weight: 700; color: #12304a;">${n.title}</div>
          <div style="font-size: 0.8rem; color: #52667a; margin-top: 0.25rem; line-height: 1.45;">${n.description}</div>
        </div>
      `;
    }).join("");
  }
}
