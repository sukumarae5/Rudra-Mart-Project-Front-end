import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages === 0) return null;

  // Window size around current page (number of pages to show before and after current page)
  const delta = 2;
  let startPage = Math.max(1, currentPage - delta);
  let endPage = Math.min(totalPages, currentPage + delta);

  // Adjust start and end if we are near the edges
  if (currentPage <= delta) {
    endPage = Math.min(totalPages, 1 + 2 * delta);
  }
  if (currentPage + delta >= totalPages) {
    startPage = Math.max(1, totalPages - 2 * delta);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handleClick = (page) => {
    if (page !== currentPage) onPageChange(page);
  };

  return (
    <div className="d-flex justify-content-end mt-3 flex-wrap">
      <Pagination size="sm" className="mb-0">
        <Pagination.First
          disabled={currentPage === 1}
          onClick={() => handleClick(1)}
        />
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handleClick(currentPage - 1)}
        />

        {/* Show first page and ellipsis if startPage > 1 */}
        {startPage > 1 && (
          <>
            <Pagination.Item onClick={() => handleClick(1)}>1</Pagination.Item>
            {startPage > 2 && <Pagination.Ellipsis disabled />}
          </>
        )}

        {/* Render page numbers */}
        {pages.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handleClick(page)}
          >
            {page}
          </Pagination.Item>
        ))}

        {/* Show last page and ellipsis if endPage < totalPages */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <Pagination.Ellipsis disabled />}
            <Pagination.Item onClick={() => handleClick(totalPages)}>
              {totalPages}
            </Pagination.Item>
          </>
        )}

        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => handleClick(currentPage + 1)}
        />
        <Pagination.Last
          disabled={currentPage === totalPages}
          onClick={() => handleClick(totalPages)}
        />
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
