import { useState, useEffect } from 'react';
import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string | null;
  date_start: number;
  date_end: number;
}

export const ArtworksTable = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(12);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);

  useEffect(() => {
    setLoading(true);
    const fields = "id,title,place_of_origin,artist_display,inscriptions,date_start,date_end";
    const apiUrl = `https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${rowsPerPage}&fields=${fields}`;

    axios.get(apiUrl)
      .then(response => {
        setArtworks(response.data.data);
        setTotalRecords(response.data.pagination.total);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data from API:", error);
        setLoading(false);
      });
  }, [currentPage, rowsPerPage]);

  const onPageChange = (event: DataTablePageEvent) => {
    setCurrentPage((event.page ?? 0) + 1);
    setRowsPerPage(event.rows);
  };

  const onSelectionChange = (event: { value: Artwork[] }) => {
    setSelectedRows(event.value);
  };
  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h1>Artworks from The Art Institute of Chicago</h1>
      <DataTable
        value={artworks}
        loading={loading}
        dataKey="id"
        selectionMode="multiple"
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        paginator
        rows={rowsPerPage}
        totalRecords={totalRecords}
        lazy
        first={(currentPage - 1) * rowsPerPage}
        onPage={onPageChange}
        rowsPerPageOptions={[12, 25, 50]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} artworks"
        tableStyle={{ minWidth: '50rem' }}>
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="title" header="Title"></Column>
        <Column field="artist_display" header="Artist"></Column>
        <Column field="place_of_origin" header="Origin"></Column>
        <Column field="date_start" header="Start Date"></Column>
        <Column field="date_end" header="End Date"></Column>
      </DataTable>
    </div>
  );
};