import React from 'react';

const Pagination = ({ currentPage, itemsPerPage, length, onPageChanged }) => {

    const pagesCount = Math.ceil(length / itemsPerPage);
    const pages = [];

    for(let i = 1 ; i <= pagesCount ; i++){
        pages.push(i);
    }

    return (
        <div>
            <ul className="pagination pagination-sm">
                <li className={"page-item" + (currentPage === 1 && " disabled")}>
                    <a className="page-link" onClick={() => onPageChanged(currentPage - 1)}>&laquo;</a>
                </li>
                {pages.map(page =>
                    // dynamic JS className
                    <li key={page} className={"page-item" + (currentPage === page && " active")}>
                        <button className="page-link" onClick={() => onPageChanged(page)}>
                            {page}
                        </button>
                    </li>
                )}
                <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                    <a className="page-link" onClick={() => onPageChanged(currentPage + 1)}>&raquo;</a>
                </li>
            </ul>
        </div>
    );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
    // departure value and step
    const start = currentPage * itemsPerPage - itemsPerPage;
    return items.slice(start, start + itemsPerPage);
};

export default Pagination;