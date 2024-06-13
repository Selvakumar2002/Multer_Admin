import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, Text, View, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import '../cssfile/Maintable.css'

const Maintable = () => {
    const [formData, setFormData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Set the number of items per page
    const [checkedItems, setCheckedItems] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleCheckboxChange = (id) => {
        setCheckedItems(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const handleSelectAllChange = () => {
        const newCheckedItems = {};
        currentItems.forEach(item => {
            newCheckedItems[item._id] = !selectAll;
        });
        setCheckedItems(newCheckedItems);
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/');
            setFormData(response.data);
            setFilteredData(response.data); // Initialize filtered data with all data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            try {
                await axios.delete(`http://localhost:5000/${id}`);
                fetchData(); // Refresh the data
            } catch (error) {
                console.error('There was an error deleting the data!', error);
            }
        }
    };

    const handleDeleteSelected = async () => {
        if (window.confirm("Are you sure you want to delete selected items?")) {
            const idsToDelete = Object.keys(checkedItems).filter(id => checkedItems[id]);
            try {
                await Promise.all(idsToDelete.map(id => axios.delete(`http://localhost:5000/${id}`)));
                fetchData(); // Refresh the data
            } catch (error) {
                console.error('There was an error deleting the selected data!', error);
            }
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = formData.filter(data =>
            data.name.toLowerCase().includes(query) ||
            data.email.toLowerCase().includes(query) ||
            data.contact.toLowerCase().includes(query) ||
            data.city.toLowerCase().includes(query) ||
            data.area.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page on new search
    };

    const styles = StyleSheet.create({
        page: {
            padding: 30,
            flexDirection: 'column',
            backgroundColor: '#E4E4E4'
        },
        table: {
            display: "table",
            width: "auto",
            borderStyle: "solid",
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0
        },
        tableRow: {
            flexDirection: "row"
        },
        tableCol: {
            width: "14.5%",
            borderStyle: "solid",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableCell: {
            margin: "auto",
            marginTop: 5,
            fontSize: 10
        },
        image: {
            width: 50,
            height: 50,
            margin: "auto"
        }
    });

    const generatePDF = async () => {
        const doc = (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={{ textAlign: "center" }} ><Text >Customer Details</Text></View>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Name</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Email</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Contact</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>City</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Area</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Password</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Image</Text></View>
                        </View>
                        {filteredData.map((data, index) => (
                            <View style={styles.tableRow} key={index}>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.name}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.email}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.contact}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.city}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.area}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{data.password}</Text></View>
                                <View style={styles.tableCol}>
                                    {data.imagePath ? (
                                        <Image style={styles.image} src={`http://localhost:5000/${data.imagePath}`} />
                                    ) : (
                                        <Text style={styles.tableCell}>No Image</Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </Page>
            </Document>
        );

        const blob = await pdf(doc).toBlob();
        saveAs(blob, 'document.pdf');
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    const prevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));

    return (
        <div className="container">
            <div className='pagina123'>
                <h2 className='pageh2'>Form Data</h2>
                <input
                    id='searchbox'
                    type='search'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder='        Search by name, email, contact, city, area'
                />
                {/* <button  className="btn btn-primary mb-2">Download PDF</button> */}
                <select className="form-control  primary mb-2" style={{width:"12%"}}>
                        <option value=''>Select Download</option>
                        <option   onClick={generatePDF}>PDF</option>
                        <option >CVS</option>
                        <option >EXCEL</option>
                    </select>
                <button onClick={handleDeleteSelected} className="btn btn-danger mb-2">Delete Selected</button>
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className="page-item">
                            <button onClick={prevPage} className="page-link" aria-label="Previous">
                                <i className="bi bi-arrow-left-circle-fill"></i>
                            </button>
                        </li>
                        {[...Array(totalPages).keys()].map(number => (
                            <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                <button onClick={() => paginate(number + 1)} className="page-link">
                                    {number + 1}
                                </button>
                            </li>
                        ))}
                        <li className="page-item">
                            <button onClick={nextPage} className="page-link" aria-label="Next">
                                <i className="bi bi-arrow-right-circle-fill"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <div>
                <div className="table-container">
                    <table data-bs-spy="scroll" className="table table-bordered">
                        <thead className="thead-dark thead-tr">
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAllChange}
                                    />
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>City</th>
                                <th>Area</th>
                                <th>Password</th>
                                <th>Image</th>
                                <th>Delete</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((data, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={checkedItems[data._id] || false}
                                            onChange={() => handleCheckboxChange(data._id)}
                                        />
                                    </td>
                                    <td>{data.name}</td>
                                    <td>{data.email}</td>
                                    <td>{data.contact}</td>
                                    <td>{data.city}</td>
                                    <td>{data.area}</td>
                                    <td>{data.password}</td>
                                    <td>
                                        {data.imagePath ? (
                                            <img src={`http://localhost:5000/${data.imagePath}`} alt="Uploaded" className="img-thumbnail" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                                        ) : (
                                            'No Image'
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(data._id)} className="btn btndel">
                                            <i className="bi bi-trash3-fill"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btnedit">
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Maintable;
