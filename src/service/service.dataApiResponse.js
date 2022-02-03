export default (records, page, count, limit) => {
    let last = Math.ceil(count/limit);
    return {
        records, 
        nbRecords : count,
        page : {
            current : page,
            previous: (page > 1) ? page-1 : null,
            next: (page < last) ? page+1 : null,
            last: last
        }
    };
}