/**
 * rhythm-dropdown.js
 *
 * Manages the custom glassmorphic rhythm selector dropdown.
 * Responsibilities:
 *   - Mirrors options from the hidden native <select> into the custom UI
 *   - Handles open/close, outside-click dismissal, and filter input
 *   - Delegates actual rhythm switching to window.switchHeartRhythm (set by main.ts)
 *   - Keeps the EKG header label in sync with the selected rhythm name
 */

(function initRhythmDropdown() {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const nativeSelect       = document.getElementById("rhythmSelect");
    const trigger            = document.getElementById("customRhythmTrigger");
    const selectedText       = document.getElementById("customRhythmSelected");
    const optionsContainer   = document.getElementById("customRhythmOptions");
    const wrapper            = document.getElementById("customRhythmSelectWrapper");
    const ekgRhythmNameEl    = document.getElementById("ekg-rhythm-name");

    if (!nativeSelect || !trigger || !selectedText || !optionsContainer || !wrapper) {
      console.warn("rhythm-dropdown: one or more required elements not found.");
      return;
    }

    // ── Open / close ──────────────────────────────────────────────────────

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.classList.toggle("open");

      // Reset filter text when re-opening
      if (wrapper.classList.contains("open")) {
        const filter = optionsContainer.querySelector("#rhythmFilter");
        if (filter) {
          filter.value = "";
          optionsContainer
            .querySelectorAll(".custom-select-option")
            .forEach((el) => (el.style.display = ""));
        }
      }
    });

    // Close when clicking outside the wrapper
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove("open");
      }
    });

    // ── Option selection ──────────────────────────────────────────────────

    /**
     * Called when the user picks a rhythm from the custom dropdown.
     * @param {HTMLElement} optionDiv - The clicked option element
     * @param {HTMLOptionElement} opt - The corresponding native <option>
     */
    function selectOption(optionDiv, opt) {
      // Update selected state in the custom list
      optionsContainer
        .querySelectorAll(".custom-select-option")
        .forEach((el) => el.classList.remove("selected"));
      optionDiv.classList.add("selected");

      // Sync native select
      nativeSelect.value = opt.value;
      selectedText.textContent = opt.textContent;
      wrapper.classList.remove("open");

      // Delegate to the app's rhythm controller
      if (typeof window.switchHeartRhythm === "function") {
        window.switchHeartRhythm(opt.value);
      }

      // Keep EKG header label in sync
      if (ekgRhythmNameEl) {
        ekgRhythmNameEl.textContent = opt.textContent;
      }
    }

    // ── Build option list from native <select> ───────────────────────────

    /**
     * Rebuilds the custom option list whenever the native <select> changes.
     * A MutationObserver calls this whenever options are added/updated.
     */
    function buildOptions() {
      optionsContainer.innerHTML = "";

      // Filter input
      const filterInput = document.createElement("input");
      filterInput.type = "text";
      filterInput.id = "rhythmFilter";
      filterInput.placeholder = "Filter...";
      filterInput.style.marginBottom = "10px";
      filterInput.addEventListener("input", () => {
        const query = filterInput.value.toLowerCase();
        optionsContainer
          .querySelectorAll(".custom-select-option")
          .forEach((el) => {
            el.style.display = el.textContent.toLowerCase().includes(query) ? "" : "none";
          });
      });
      optionsContainer.appendChild(filterInput);

      // Option rows
      Array.from(nativeSelect.options).forEach((opt, index) => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "custom-select-option";
        optionDiv.textContent = opt.textContent;
        optionDiv.dataset.value = opt.value;

        // Mark initial selection
        if (opt.selected || index === 0) {
          if (index === 0 && !nativeSelect.value) {
            nativeSelect.value = opt.value;
          }
          selectedText.textContent = opt.textContent;
          optionDiv.classList.add("selected");
        }

        optionDiv.addEventListener("click", (e) => {
          e.stopPropagation();
          selectOption(optionDiv, opt);
        });

        optionsContainer.appendChild(optionDiv);
      });
    }

    // ── Observe native select for dynamically added options ──────────────

    const observer = new MutationObserver(buildOptions);
    observer.observe(nativeSelect, { childList: true });
  });
})();
