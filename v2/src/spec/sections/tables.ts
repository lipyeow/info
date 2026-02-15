import type { ColSpec, TableOptions } from '../../components/data-table.js';

export interface TableDef {
  id: string;
  label: string;
  dataUrl: string;
  colspecs: ColSpec[];
  options: TableOptions;
}

export const tPub: TableDef = {
  id: 'tPub',
  label: '<i>Scientific articles I have (co-)authored.</i>',
  dataUrl: 'https://lipyeow.github.io/info/data/pubs.json',
  colspecs: [
    { title: 'Year', field: 'year', defaultSort: 'desc' },
    { title: 'Venue', field: 'venue' },
    { title: 'Title', field: 'title', cellStyle: { minWidth: '350px' } },
    { title: 'Authors', field: 'authors' },
    {
      title: 'pdf',
      field: 'pdf',
      link: { prefix: 'https://lipyeow.github.io/home/', text: 'pdf' },
    },
  ],
  options: {
    search: true,
    paging: false,
    exportButton: true,
    maxBodyHeight: '70vh',
    padding: 'dense',
    headerStyle: { backgroundColor: '#FDEBD0' },
  },
};

export const tStu: TableDef = {
  id: 'tStu',
  label: '<i>Students I have had the privilege of mentoring</i>',
  dataUrl: 'https://lipyeow.github.io/info/data/students.json',
  colspecs: [
    { title: 'Year', field: 'year' },
    { title: 'Degree', field: 'degree' },
    { title: 'Name', field: 'name', cellStyle: { minWidth: '250px' } },
    { title: 'Thesis', field: 'thesis', cellStyle: { minWidth: '550px' } },
  ],
  options: {
    search: true,
    paging: false,
    exportButton: true,
    maxBodyHeight: '50vh',
    padding: 'dense',
    headerStyle: { backgroundColor: '#FDEBD0' },
  },
};

export const tTeach: TableDef = {
  id: 'tTeach',
  label: '<i>Undergraduate and graduate courses I have taught</i>',
  dataUrl: 'https://lipyeow.github.io/info/data/teaching.json',
  colspecs: [
    { title: 'Year', field: 'year', defaultSort: 'desc' },
    { title: 'Semester', field: 'semester' },
    { title: 'Course', field: 'num' },
    { title: 'Title', field: 'title', defaultGroupOrder: 0 },
    { title: 'Level', field: 'level' },
    { title: 'Website', field: 'url', link: { text: '' } },
  ],
  options: {
    search: true,
    paging: false,
    exportButton: true,
    maxBodyHeight: '50vh',
    padding: 'dense',
    grouping: true,
    headerStyle: { backgroundColor: '#FDEBD0' },
  },
};

export const tProjects: TableDef = {
  id: 'tProjects',
  label: '<i>Interesting projects I have worked on.</i>',
  dataUrl: 'https://lipyeow.github.io/info/data/projects.json',
  colspecs: [
    { title: 'Dates', field: 'display_date', cellStyle: { minWidth: '100px' } },
    { title: 'Title', field: 'title', cellStyle: { minWidth: '140px' } },
    { title: 'Role', field: 'role', cellStyle: { minWidth: '100px' } },
    { title: 'Affiliation', field: 'affiliation', cellStyle: { minWidth: '100px' } },
    { title: 'Description', field: 'desc', cellStyle: { minWidth: '350px' } },
  ],
  options: {
    search: true,
    paging: false,
    exportButton: true,
    maxBodyHeight: '70vh',
    padding: 'dense',
    headerStyle: { backgroundColor: '#FDEBD0' },
  },
};
