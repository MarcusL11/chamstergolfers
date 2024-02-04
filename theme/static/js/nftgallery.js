
// Function to toggle all the attributes in the nft page
function toggleSection(categories) {
    categories.forEach(category => {
        const expandIcon = document.querySelector(category.expandId);
        const collapseIcon = document.querySelector(category.collapseId);
        const section = document.querySelector(category.sectionId);
        const button = document.querySelector(category.buttonId);

        button.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            expandIcon.style.display = expanded ? 'block' : 'none';
            collapseIcon.style.display = expanded ? 'none' : 'block';
            section.style.display = expanded ? 'none' : 'block';
        });
    });
}

// To toggle the sort button in the nft page
function toggleSort(buttonId, sectionId) {
    const sortSection = document.querySelector(sectionId);
    const button = document.querySelector(buttonId);

    const toggleMenu = () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !expanded);
        sortSection.style.display = expanded ? 'none' : 'block';
    };

    button.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevents immediate closing when the button is clicked
        toggleMenu();
    });

    document.addEventListener('click', function (event) {
        if (!button.contains(event.target) && event.target !== sortSection) {
            button.setAttribute('aria-expanded', 'false');
            sortSection.style.display = 'none';
        }
    });
}

function toggleCheckboxes(categories) {
  const currentURL = window.location.search;
  const urlParam = new URLSearchParams(currentURL);
  const searchValues = categories.map(category => urlParam.get(category.searchParam));

  // For the purpose of accessing the DOM once and to be resue 
  const categoryElements = categories.map(category => {
      return {
          ...category,
          checkboxes: document.querySelectorAll(`input[name="${category.inputName}"]`),
          button: document.querySelector(category.buttonId),
          sectionDisplay: document.querySelector(category.sectionId),
          expandIcon: document.querySelector(category.expandId),
          collapseIcon: document.querySelector(category.collapseId)
      };
  });

  categoryElements.forEach((categoryElement, index) => {
      categoryElement.checkboxes.forEach(checkbox => {
          checkbox.addEventListener('change', function () {
              // Uncheck all other checkboxes in the same category
              categoryElement.checkboxes.forEach(otherCheckbox => {
                  if (otherCheckbox !== checkbox) {
                      otherCheckbox.checked = false;
                  }
              });

              const newURL = window.location.origin + window.location.pathname;
              // the URLSearchParams object in JavaScript auto separates the parameters with '&'
              const params = new URLSearchParams();

              categoryElements.forEach(categoryElement => {
                  const checkedCheckbox = Array.from(categoryElement.checkboxes).find(checkbox => checkbox.checked);
                  if (checkedCheckbox) {
                      params.set(categoryElement.searchParam, checkedCheckbox.value);
                  } else {
                      params.delete(categoryElement.searchParam);
                  }
              });

              const queryString = params.toString();
              window.location.href = queryString ? `${newURL}?${queryString}` : newURL;
          });
      });

      if (searchValues[index]) {
          const decodedSearchValue = decodeURIComponent(searchValues[index]);

          categoryElement.checkboxes.forEach(checkbox => {
              if (checkbox.value === decodedSearchValue) {
                  checkbox.checked = true;
                  categoryElement.button.setAttribute('aria-expanded', 'true');
                  categoryElement.sectionDisplay.style.display = 'block';
                  categoryElement.expandIcon.style.display = 'none';
                  categoryElement.collapseIcon.style.display = 'block';
              } else {
                  checkbox.checked = false;
              }
          });
      }
  });
}

function sortByTsi() {
  const ascendButton = document.getElementById('menu-item-0');
  const descendButton = document.getElementById('menu-item-1');
  const url = window.location.href;
  const orderParam = 'ordering=';
  const pageIndex = url.indexOf(orderParam);

  ascendButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default behavior
    console.log('Ascending button clicked');

    let newUrl;
    if (pageIndex !== -1) {
      newUrl = url.slice(0, pageIndex) + orderParam + 'tsi';
    } else {
      newUrl = url.includes('?') ? url + '&' + orderParam + 'tsi' : url + '?' + orderParam + 'tsi';
    }

    window.location.href = newUrl; // Redirect to the new URL
  });

  descendButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default behavior
    console.log('Descending button clicked');

    let newUrl;
    if (pageIndex !== -1) {
      newUrl = url.slice(0, pageIndex) + orderParam + '-tsi';
    } else {
      newUrl = url.includes('?') ? url + '&' + orderParam + '-tsi' : url + '?' + orderParam + '-tsi';
    }

    window.location.href = newUrl; // Redirect to the new URL
  });
}

document.addEventListener('DOMContentLoaded', function () {

    toggleSort('#sort-button', '#dropdown-menu');

    toggleCheckboxes([
        { searchParam: 'search_series', inputName: 'series[]', buttonId: '#toggle-series', sectionId: '#filter-section-series', expandId: '#expand-series', collapseId: '#collapse-series' },
        { searchParam: 'search_name', inputName: 'name[]', buttonId: '#toggle-name', sectionId: '#filter-section-name', expandId: '#expand-name', collapseId: '#collapse-name' },
        { searchParam: 'search_background', inputName: 'background[]', buttonId: '#toggle-background', sectionId: '#filter-section-background', expandId: '#expand-background', collapseId: '#collapse-background' },
        { searchParam: 'search_fur', inputName: 'fur[]', buttonId: '#toggle-fur', sectionId: '#filter-section-fur', expandId: '#expand-fur', collapseId: '#collapse-fur' },
        { searchParam: 'search_shirt', inputName: 'shirt[]', buttonId: '#toggle-shirt', sectionId: '#filter-section-shirt', expandId: '#expand-shirt', collapseId: '#collapse-shirt' },
        { searchParam: 'search_pants', inputName: 'pants[]', buttonId: '#toggle-pants', sectionId: '#filter-section-pants', expandId: '#expand-pants', collapseId: '#collapse-pants' },
        { searchParam: 'search_head', inputName: 'head[]', buttonId: '#toggle-head', sectionId: '#filter-section-head', expandId: '#expand-head', collapseId: '#collapse-head' },
        { searchParam: 'search_eyes', inputName: 'eyes[]', buttonId: '#toggle-eyes', sectionId: '#filter-section-eyes', expandId: '#expand-eyes', collapseId: '#collapse-eyes' },
        { searchParam: 'search_club', inputName: 'club[]', buttonId: '#toggle-club', sectionId: '#filter-section-club', expandId: '#expand-club', collapseId: '#collapse-club' },
        { searchParam: 'search_power', inputName: 'power[]', buttonId: '#toggle-power', sectionId: '#filter-section-power', expandId: '#expand-power', collapseId: '#collapse-power' },
        { searchParam: 'search_putting', inputName: 'putting[]', buttonId: '#toggle-putting', sectionId: '#filter-section-putting', expandId: '#expand-putting', collapseId: '#collapse-putting' },
        { searchParam: 'search_accuracy', inputName: 'accuracy[]', buttonId: '#toggle-accuracy', sectionId: '#filter-section-accuracy', expandId: '#expand-accuracy', collapseId: '#collapse-accuracy' },
        { searchParam: 'search_luck', inputName: 'luck[]', buttonId: '#toggle-luck', sectionId: '#filter-section-luck', expandId: '#expand-luck', collapseId: '#collapse-luck' },
        { searchParam: 'search_recovery', inputName: 'recovery[]', buttonId: '#toggle-recovery', sectionId: '#filter-section-recovery', expandId: '#expand-recovery', collapseId: '#collapse-recovery' },
        { searchParam: 'search_specialty', inputName: 'specialty[]', buttonId: '#toggle-specialty', sectionId: '#filter-section-specialty', expandId: '#expand-specialty', collapseId: '#collapse-specialty' },
        { searchParam: 'search_tsi', inputName: 'tsi[]', buttonId: '#toggle-tsi', sectionId: '#filter-section-tsi', expandId: '#expand-tsi', collapseId: '#collapse-tsi' },
    ]);

    toggleSection([
        { buttonId: '#toggle-series', expandId: '#expand-series', collapseId: '#collapse-series', sectionId: '#filter-section-series'},
        { buttonId: '#toggle-name', expandId: '#expand-name', collapseId: '#collapse-name', sectionId: '#filter-section-name' },
        { buttonId: '#toggle-background', expandId: '#expand-background', collapseId: '#collapse-background', sectionId: '#filter-section-background' },
        { buttonId: '#toggle-fur', expandId: '#expand-fur', collapseId: '#collapse-fur', sectionId: '#filter-section-fur' },
        { buttonId: '#toggle-shirt', expandId: '#expand-shirt', collapseId: '#collapse-shirt', sectionId: '#filter-section-shirt' },
        { buttonId: '#toggle-pants', expandId: '#expand-pants', collapseId: '#collapse-pants', sectionId: '#filter-section-pants' },
        { buttonId: '#toggle-head', expandId: '#expand-head', collapseId: '#collapse-head', sectionId: '#filter-section-head' },
        { buttonId: '#toggle-eyes', expandId: '#expand-eyes', collapseId: '#collapse-eyes', sectionId: '#filter-section-eyes' },
        { buttonId: '#toggle-club', expandId: '#expand-club', collapseId: '#collapse-club', sectionId: '#filter-section-club' },
        { buttonId: '#toggle-power', expandId: '#expand-power', collapseId: '#collapse-power', sectionId: '#filter-section-power' },
        { buttonId: '#toggle-putting', expandId: '#expand-putting', collapseId: '#collapse-putting', sectionId: '#filter-section-putting' },
        { buttonId: '#toggle-accuracy', expandId: '#expand-accuracy', collapseId: '#collapse-accuracy', sectionId: '#filter-section-accuracy' },
        { buttonId: '#toggle-luck', expandId: '#expand-luck', collapseId: '#collapse-luck', sectionId: '#filter-section-luck' },
        { buttonId: '#toggle-recovery', expandId: '#expand-recovery', collapseId: '#collapse-recovery', sectionId: '#filter-section-recovery' },
        { buttonId: '#toggle-specialty', expandId: '#expand-specialty', collapseId: '#collapse-specialty', sectionId: '#filter-section-specialty' },
    ]);

    sortByTsi();
});

document.getElementById('prevButton').addEventListener('click', function() {
    const url = window.location.href;
    const pageParam = 'page=';
    // looks for the first occurnace of 'page='
    const pageIndex = url.indexOf(pageParam);
    if (pageIndex !== -1) {
        // returns the page value
        let pageValue = parseInt(url.slice(pageIndex + pageParam.length));

        if (pageValue > 1) {
            // reduces the page value by 1
            let newUrl = url.slice(0, pageIndex) + pageParam + (pageValue - 1);
            window.location.href = newUrl;
        }
    }
});

document.getElementById('nextButton').addEventListener('click', function() {
    const url = window.location.href;
    const pageParam = 'page=';
    const pageIndex = url.indexOf(pageParam);

    if (pageIndex !== -1) {
        let pageValue = parseInt(url.slice(pageIndex + pageParam.length));
        let newUrl = url.slice(0, pageIndex) + pageParam + (pageValue + 1);
        window.location.href = newUrl;
    } else {
        window.location.href = url.includes('?') ? url + '&page=2' : url + '?page=2';
    }
});
