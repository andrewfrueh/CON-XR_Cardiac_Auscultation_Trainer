document.addEventListener("DOMContentLoaded", () => {
  const nativeSelect = document.getElementById("rhythmSelect");
  const trigger = document.getElementById("customRhythmTrigger");
  const selectedText = document.getElementById("customRhythmSelected");
  const optionsContainer = document.getElementById("customRhythmOptions");
  const wrapper = document.getElementById("customRhythmSelectWrapper");

  // Toggle dropdown
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    wrapper.classList.toggle("open");
    // reset filter when opening
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

  // Close when clicking outside of the wrapper
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove("open");
    }
  });

  // Observer to populate options when native select is updated
  const observer = new MutationObserver(() => {
    // clear existing options and add filter input
    optionsContainer.innerHTML = "";

    // create filter field as first child
    const filterInput = document.createElement("input");
    filterInput.type = "text";
    filterInput.id = "rhythmFilter";
    filterInput.placeholder = "Filter...";
    filterInput.style.marginBottom = "10px";
    filterInput.addEventListener("input", () => {
      const text = filterInput.value.toLowerCase();
      optionsContainer
        .querySelectorAll(".custom-select-option")
        .forEach((el) => {
          const label = el.dataset.label || el.textContent;
          el.style.display = label.toLowerCase().includes(text) ? "" : "none";
        });
    });
    optionsContainer.appendChild(filterInput);

    Array.from(nativeSelect.options).forEach((opt, index) => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "custom-select-option";
      optionDiv.dataset.value = opt.value;
      optionDiv.dataset.label = opt.textContent;

      // Build label span
      const labelSpan = document.createElement("span");
      labelSpan.textContent = opt.textContent;
      optionDiv.appendChild(labelSpan);

      // Inject "New" badge if the option has data-is-new
      if (opt.dataset.isNew === "true") {
        const badge = document.createElement("span");
        badge.className = "badge-new";
        badge.textContent = "New";
        optionDiv.appendChild(badge);
      }

      // Set initial selected
      if (opt.selected || index === 0) {
        if (index === 0 && !nativeSelect.value) {
          nativeSelect.value = opt.value;
        }
        selectedText.textContent = opt.textContent;
        optionDiv.classList.add("selected");
      }

      optionDiv.addEventListener("click", (e) => {
        e.stopPropagation();
        // Remove selected class from all options
        document
          .querySelectorAll(".custom-select-option")
          .forEach((el) => el.classList.remove("selected"));
        optionDiv.classList.add("selected");

        nativeSelect.value = opt.value;
        selectedText.textContent = opt.textContent;
        wrapper.classList.remove("open");

        if (typeof window.switchHeartRhythm === "function") {
          window.switchHeartRhythm(opt.value);
        }
      });
      optionsContainer.appendChild(optionDiv);
    });
  });

  // Observe native select for child node modifications (options added)
  if (nativeSelect) {
    observer.observe(nativeSelect, { childList: true });
  }
});
