import React, { useEffect, useState } from "react";
import axiosInstance from "../context/axiosInstance";
import Modal from "./Modal"; // use your helper
import "../css/Customer360Modal.css";

function Customer360Modal({ customerId, isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customerId) {
      setLoading(true);
      axiosInstance
        .get(`/customers/${customerId}`)
        .then((res) => setData(res.data))
        .catch((err) => console.error("❌ Failed to fetch customer 360", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, customerId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {loading ? (
        <p>Loading...</p>
      ) : data ? (
        <div className="customer-360">
          <h2 className="c360-title">Customer 360</h2>

          <div className="c360-section profile">
            <h3>{data.profile.name}</h3>
            <p>
              <b>Email:</b> {data.profile.email}
            </p>
            <p>
              <b>Phone:</b> {data.profile.phone}
            </p>
          </div>

          <div className="c360-section">
            <h4>Installations</h4>
            {data.installations.length > 0 ? (
              <ul className="c360-list">
                {data.installations.map((i) => (
                  <li key={i.id}>
                    <span className="tag">{i.package_type}</span>
                    <span>{i.status}</span>
                    <span>${i.price}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">No installations</p>
            )}
          </div>

          <div className="c360-section">
            <h4>Invoices</h4>
            {data.invoices.length > 0 ? (
              <ul className="c360-list">
                {data.invoices.map((inv) => (
                  <li key={inv.id}>
                    <span>#{inv.id}</span>
                    <span>${inv.amount}</span>
                    <span className={`status ${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">No invoices</p>
            )}
          </div>

          <div className="c360-section">
            <h4>Tickets</h4>
            {data.tickets.length > 0 ? (
              <ul className="c360-list">
                {data.tickets.map((t) => (
                  <li key={t.id}>{t.subject}</li>
                ))}
              </ul>
            ) : (
              <p className="empty">No tickets</p>
            )}
          </div>
        </div>
      ) : (
        <p>No customer data found.</p>
      )}
    </Modal>
  );
}

export default Customer360Modal;
