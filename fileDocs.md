##Workspace file | .wrkspc

Json object that contains a visual representation of client data, a 


##Filter List file | .fltr

Json object that contains keys, each key pertains to a specific column in the client csv data or a key in the client json data. Typically operates on the normalized data values. Each key represents an array of all the filters. Since some column values can be multi-valued we can filter on multiple (inclusive)

Format:

{
    QueryA1: {
        column1: [value1, value2],
        column2: [value1]
    }, 

    QueryA2: {
        column1: [value1, value2],
        column2: [value1]
    }

    
}