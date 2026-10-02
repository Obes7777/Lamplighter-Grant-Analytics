export default class reader{

    adjuster

    filterBin
    filterListBin
    currentFilters
    filteredCount
    table

    constructor(adjuster){
        this.filterBin = adjuster.filterBin
        this.filterListBin = adjuster.filterListBin
        this.currentFilters = adjuster.currentFilters
        this.filteredCount = adjuster.filteredCount
        this.table = adjuster.table

        this.adjuster = adjuster
    }

}