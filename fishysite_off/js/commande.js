/* =============================================
   js/commande.js — Filter tabs for commands page
   ============================================= */

(function () {
  const tabs = document.querySelectorAll('.cmd-tab');
  const sections = document.querySelectorAll('.cmd-section');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      // Update active tab
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide sections
      sections.forEach((section) => {
        if (filter === 'all' || section.dataset.category === filter) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });
    });
  });
})();