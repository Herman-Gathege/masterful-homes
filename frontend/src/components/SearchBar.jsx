// frontend/src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../context/axiosInstance";
import Customer360Modal from "./Customer360Modal";
import Modal from "./Modal"; 
import "../css/SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faUser,
  faUserTie,
  faHouse,
  faFileInvoiceDollar,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";


function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // modals
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedInstallation, setSelectedInstallation] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const containerRef = useRef(null);

  // debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        fetchResults(query);
      } else {
        setResults(null);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchResults = async (searchTerm) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/search?q=${searchTerm}`);
      setResults(res.data);
    } catch (err) {
      console.error("❌ Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ESC key → clear
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setQuery("");
        setResults(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Click outside → close results
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setResults(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-bar-container" ref={containerRef}>
      <div className="search-input-wrapper">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search customers, users, installations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        {query && (
          <button className="clear-btn" onClick={() => { setQuery(""); setResults(null); }}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      {loading && <div className="search-loading">Searching...</div>}

      {results && (
        <div className="search-results">
          {/* Customers */}
          {results.customers?.length > 0 && (
            <div className="result-group">
              <h4>Customers</h4>
              <ul>
                {results.customers.map((c) => (
                  <li key={`customer-${c.id}`} onClick={() => setSelectedCustomer(c.id)}>
                    <FontAwesomeIcon icon={faUser} /> {c.name} ({c.email})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Users */}
          {results.users?.length > 0 && (
            <div className="result-group">
              <h4>Users</h4>
              <ul>
                {results.users.map((u) => (
                  <li key={`user-${u.id}`} onClick={() => setSelectedUser(u)}>
                    <FontAwesomeIcon icon={faUserTie} /> {u.username} — {u.role}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Installations */}
          {results.installations?.length > 0 && (
            <div className="result-group">
              <h4>Installations</h4>
              <ul>
                {results.installations.map((i) => (
                  <li key={`install-${i.id}`} onClick={() => setSelectedInstallation(i)}>
                    <FontAwesomeIcon icon={faHouse} /> {i.package_type} — {i.status} — {i.customer_name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Invoices */}
          {results.invoices?.length > 0 && (
            <div className="result-group">
              <h4>Invoices</h4>
              <ul>
                {results.invoices.map((inv) => (
                  <li key={`inv-${inv.id}`} onClick={() => setSelectedInvoice(inv)}>
                    <FontAwesomeIcon icon={faFileInvoiceDollar} /> #{inv.id} — ${inv.amount} — {inv.status}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tickets */}
          {results.tickets?.length > 0 && (
            <div className="result-group">
              <h4>Tickets</h4>
              <ul>
                {results.tickets.map((t) => (
                  <li key={`ticket-${t.id}`} onClick={() => setSelectedTicket(t)}>
                    <FontAwesomeIcon icon={faTicketAlt} /> {t.issue} — {t.status}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No results */}
          {Object.values(results).every((arr) => arr.length === 0) && (
            <p className="no-results">No matches found.</p>
          )}
        </div>
      )}

      {/* Customer360 Modal */}
      <Customer360Modal
        customerId={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      {/* User Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)}>
        {selectedUser && (
          <div>
            <h3>User Profile</h3>
            <p><b>Username:</b> {selectedUser.username}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Role:</b> {selectedUser.role}</p>
          </div>
        )}
      </Modal>

      {/* Installation Modal */}
      <Modal isOpen={!!selectedInstallation} onClose={() => setSelectedInstallation(null)}>
        {selectedInstallation && (
          <div>
            <h3>Installation #{selectedInstallation.id}</h3>
            <p><b>Customer:</b> {selectedInstallation.customer_name}</p>
            <p><b>Package:</b> {selectedInstallation.package_type}</p>
            <p><b>Status:</b> {selectedInstallation.status}</p>
            <p><b>Price:</b> ${selectedInstallation.price}</p>
          </div>
        )}
      </Modal>

      {/* Invoice Modal */}
      <Modal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)}>
        {selectedInvoice && (
          <div>
            <h3>Invoice #{selectedInvoice.id}</h3>
            <p><b>Amount:</b> ${selectedInvoice.amount}</p>
            <p><b>Status:</b> {selectedInvoice.status}</p>
          </div>
        )}
      </Modal>

      {/* Ticket Modal */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)}>
        {selectedTicket && (
          <div>
            <h3>Ticket #{selectedTicket.id}</h3>
            <p><b>Issue:</b> {selectedTicket.issue}</p>
            <p><b>Status:</b> {selectedTicket.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SearchBar;
