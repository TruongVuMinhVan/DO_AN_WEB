import React from 'react';
import PhysicalInfoForm from '../components/physicalInfoForm';
import PhysicalInfoHistory from '../components/PhysicalInfoHistory';

const PhysicalInfoPage = () => {
  return (
    <div className="container my-5">
      <h2 className="page-title mb-4 text-center">Theo dõi thông tin thể chất</h2>
      <div className="layout-wrapper">
        <section className="form-section card shadow-lg rounded-4">
          <header className="card-header text-white rounded-top-4">
            <h4 className="mb-1">Cập nhật thông tin thể chất</h4>
            <small>Điền các thông tin cơ bản để theo dõi sức khỏe của bạn.</small>
          </header>
          <div className="card-body">
            <PhysicalInfoForm />
          </div>
        </section>

        <section className="history-section card shadow-lg rounded-4">
          <header className="card-header text-white rounded-top-4">
            <h4 className="mb-1">Lịch sử thay đổi</h4>
            <small>Xem lại các lần cập nhật thể chất trước đây.</small>
          </header>
          <div className="card-body overflow-auto content-scroll">
            <PhysicalInfoHistory />
          </div>
        </section>
      </div>

      <style>{`
        .page-title {
          font-weight: 700;
          font-size: 2rem;
          color: #28a745;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .layout-wrapper {
          display: grid;
          grid-template-columns: 7fr 5fr;
          gap: 2rem;
          align-items: start;
        }
        .form-section .card-header {
          background: linear-gradient(90deg, #28a745, #218838);
          box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
          transition: background 0.3s ease;
          padding: 1rem 1.5rem;
        }
        .history-section .card-header {
          background: linear-gradient(90deg, #6c757d, #5a6268);
          box-shadow: 0 4px 20px rgba(108, 117, 125, 0.3);
          transition: background 0.3s ease;
          padding: 1rem 1.5rem;
        }
        .card-header:hover {
          filter: brightness(1.1);
          cursor: default;
        }
        .card {
          border: none;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        .card-body {
          flex-grow: 1;
          padding: 1.5rem;
        }
        .content-scroll {
          max-height: 600px;
          min-height: 400px;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .layout-wrapper {
            grid-template-columns: 1fr;
          }
          .content-scroll {
            max-height: 400px;
            min-height: 300px;
          }
          .card {
            margin-bottom: 2rem;
          }
        }
        @media (max-width: 576px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .page-title {
            font-size: 1.5rem;
          }
          .card-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PhysicalInfoPage;

