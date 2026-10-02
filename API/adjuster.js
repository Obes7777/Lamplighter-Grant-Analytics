class adjuster {

    // Element targets
    filterContainer
    activeFiltersList
    filteredCountText
    savedFiltersContainer
    table
    tbody

    // Values that help handle the displayed data
    currentFilters
    filteredCount

    collumnList = []

    savedFilterList // Object of card ID's with a list attatched of all card filters

    constructor(filterContainer, activeFiltersList, filteredCountText, savedFiltersContainer, table){
        this.filterContainer = filterContainer
        this.activeFiltersList = activeFiltersList
        this.filteredCountText = filteredCountText
        this.savedFiltersContainer = savedFiltersContainer
        this.table = table
        this.tbody = table.querySelector("tbody")
    }

    /*SAVED FILTER METHODS*/
    // Method to add a saved filter card to the filter list bin
    addSavedFilterCard(cardTitle, filters, filteredCountText) {
        this.savedFilterList.push([
            cardTitle,
            filteredCountText,
            filters
        ])

        this.renderSavedFilters()
    }
    addToSavedFilter(cardTitle, filters){
        for(let i = 0; i < this.savedFilterList.length; i++){
            if(this.savedFilterList[i][0] == cardTitle){
                [...this.savedFilterList[i][2], ...filters]
            }
        }

        this.renderSavedFilters()
    }
    deleteFromSavedFilter(cardTitle, filter){

    }
    deleteSavedFilter(cardTitle){

    }
    clearSavedFilter(cardTitle){
        
    }
    renderSavedFilters(){
        // Clear the bin
        this.savedFiltersContainer.innerHTML = ''
        // Render each thing

        for(let i = 0; i < this.savedFilterList.length; i ++){
            const card = document.createElement('div');
            card.className = 'saved-list-card';
            card.id = this.savedFilterList[i][0]
            
            const header = document.createElement('div');
            header.className = 'saved-list-header';
            header.textContent = this.savedFilterList[i][0];
            card.appendChild(header);
            
            const body = document.createElement('div');
            body.className = 'saved-list-body';
            body.innerHTML = this.savedFilterList[i][2].join('<br>');
            body.innerHTML += "<br>"
            card.appendChild(body);
            
            const footer = document.createElement('div');
            footer.className = 'saved-list-footer';
            footer.textContent = this.savedFilterList[i][1];
            card.appendChild(footer);
            
            this.savedFiltersContainer.appendChild(card);
        }
    }

    /*FILTER CARD METHODS*/
    // Method to add a filter card to the filter bin
    addFilterCard(filterTitle, options) {
        const card = document.createElement('div');
        card.id = filterTitle
        card.className = 'filter-card';
        
        const header = document.createElement('div');
        header.className = 'filter-card-header';
        const minimizeIcon = document.createElement('span');
        minimizeIcon.className = 'minimize-icon';
        minimizeIcon.textContent = '−';
        header.appendChild(minimizeIcon);
        header.appendChild(document.createTextNode(' ' + filterTitle));
        card.appendChild(header);
        
        const body = document.createElement('div');
        body.className = 'filter-card-body';
        options.forEach(option => {
            const label = document.createElement('label');
            label.style.cursor = 'pointer';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = option;
            checkbox.style.marginRight = '0.5rem';
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(option));
            let filteredOption = option.replaceAll(' ', '')
            filteredOption = filterTitle.replaceAll('/', '')
            label.classList.add(filteredOption)
            body.appendChild(label);
        });
        card.appendChild(body);
        
        this.filterContainer.appendChild(card);
    }
    // Deletes filter card based off the filter title
    deleteFilterCard(filterTitle){
        document.getElementById(filterTitle).remove()
    }
    // Adds filter card options
    addFilterOptions(filterTitle, options){
        const card = document.getElementById(filterTitle);

        const body = card.querySelector('.filter-card-body');
        options.forEach(option => {
            const label = document.createElement('label');
            label.style.cursor = 'pointer';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = option;
            checkbox.style.marginRight = '0.5rem';
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(option));
            let filteredOption = option.replaceAll(' ', '')
            filteredOption = filterTitle.replaceAll('/', '')
            label.classList.add(filteredOption)
            body.appendChild(label);
        });
    }
    // Deletes a single filter card option
    deleteFilterOption(filterTitle, option){
        let card = document.getElementById(filterTitle)

        let body = card.querySelector('.filter-card-body')

        let filteredOption = option.replaceAll(' ', '')
        filteredOption = filterTitle.replaceAll('/', '')
        let item = body.querySelector('.' + filteredOption)

        item.remove()
    }
    // Clears all filter options
    clearFilterOptions(filterTitle){
        let card = document.getElementById(filterTitle)

        let body = card.querySelector('.filter-card-body')

        body.innerHTML = ''
    }

    /*ACTIVE FILTERS AND FILTERED COUNT METHOD*/
    // Method to update the filtered count
    updateFilteredCount(newCount) {
        this.filteredCount = newCount
        this.filteredCountText.textContent = this.filteredCount;
    }
    // Method to change the current filters list
    changeCurrentFilters(newFilters) {
        this.currentFilters = newFilters
        this.activeFiltersList.innerHTML = this.currentFilters.join('<br>');
    }
    // Adds a filter to the active filters
    addCurrentFilter(filter){
        this.currentFilters.push(filter)
        this.activeFiltersList.innerHTML = this.currentFilters.join('<br>');
    }
    // Removes a filter to the active filters
    deleteCurrentFilter(filter){
        let index = this.currentFilters.indexOf(filter)
        if(index > -1){
            this.currentFilters.splice(index, 1)
        }
        this.activeFiltersList.innerHTML = this.currentFilters.join('<br>');
    }


    // Table METHODS
    /*
    obj example
    {
    "age at time of trafficking": 7-14, // Reads in as a number
    "name": "Jane Doe" // Reads in as a string
    "victim type": "both sex and labor trafficking"
    }
    */
    newRow(id, obj){
        tr = document.createElement("tr")
        self.tbody.appendChild(tr)

        // Loop through checking for new collumnList

        // Loop through known collumns. grab the current obj's value of that collumn (possible empty)
        // Throw thatg value in a td (If empty make the td empty. Min max width??? CHECK CSS)

        
        for(let i = 0; i < obj.length; i++){

        }
    }
    
}



// Testing Playground

adj = new adjuster(document.getElementById("filter-container"), document.getElementById("active-filters-list"), document.getElementById("filtered-count-text"), document.getElementById('saved-filter-lists'), document.getElementById("data-grid-container"))

adj.addFilterCard("Race", ['White', 'Black', 'Hispanic/ Latino', 'White', 'Black', 'White', 'Black','White', 'Black'])
adj.addFilterCard("Race1", ['White', 'Black', 'Hispanic/ Latino'])
adj.addFilterCard("Race2", ['White', 'Black', 'Hispanic/ Latino'])
adj.addFilterCard("Race3", ['White', 'Black', 'Hispanic/ Latino'])
adj.addFilterCard("Race4", ['White', 'Black', 'Hispanic/ Latino'])

adj.deleteFilterCard('Race2')

adj.addFilterOptions('Race1', ['American Indian/ Alaska Native', 'white'])

adj.deleteFilterOption("Race3", "White")
adj.clearFilterOptions('Race4')



adj.changeCurrentFilters(['Black/ African American', '0-12', '13-17', '18-24', '25-59'])
adj.addCurrentFilter('60 or older')
adj.deleteCurrentFilter('18-24')
adj.addCurrentFilter('60 or older')


adj.updateFilteredCount(50)



adj.addSavedFilterCard('Filter1', ['Black', '0-12', 'Female'], 50)
adj.addSavedFilterCard('Filter2', ['White', '13-17', 'Male'], 50)
adj.addSavedFilterCard('Filter3', ['13-17', '18-24', 'Male'], 50)

adj.addToSavedFilter("Filter1", ['White'])

adj.deleteFromSavedFilter('Filter2', 'Male')
adj.addTosuSavedFilter("Filter2", ['White'])

adj.deleteSavedFilter("Filter3")

// adj.clearSavedFilter('Filter1')

adj.newRow("01", 
    {
        "age at time of trafficking": 7-14, // Reads in as a number
        "name": "Jane Doe", // Reads in as a string
        "victim type": "both sex and labor trafficking"
    }
)


