
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  FileImage,
  Search,
  Users,
  X,
  UploadCloud,
  ShieldCheck,
  ScanLine,
} from "lucide-react";
import "./Dashboard.css";

const initialPatients = [
  {
    id: "AX-001",
    name: "Patient One",
    email: "patient1@example.com",
    age: 45,
    scan: "MRI",
    status: "Pending",
  },
  {
    id: "AX-002",
    name: "Patient Two",
    email: "patient2@example.com",
    age: 32,
    scan: "CT",
    status: "Pending",
  },
  {
    id: "AX-003",
    name: "Patient Three",
    email: "patient3@example.com",
    age: 57,
    scan: "MRI",
    status: "Pending",
  },
];

function Dashboard({ embedded = false }) {
  const { t } = useTranslation();

  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("patients");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    scan: "MRI",
  });

  const filteredPatients = useMemo(() => {
    const term = search.trim().toLowerCase();

    return patients.filter((patient) =>
      [patient.id, patient.name, patient.scan].some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  }, [patients, search]);

  function chooseView(nextView) {
    setView(nextView);
    setMessage("");
  }

  function addPatient(event) {
    event.preventDefault();

    const patient = {
      ...form,
      id: `AX-${String(Date.now()).slice(-6)}`,
      age: Number(form.age),
      status: "Pending",
    };

    setPatients((current) => [patient, ...current]);
    setForm({ name: "", age: "", scan: "MRI" });
    setView("patients");
    setMessage(
      t("dashboard.patientAdded", {
        defaultValue: "Patient added successfully.",
      })
    );
  }

  function openPatient(patient) {
    setSelectedPatient(patient);
    setFiles([]);
    setView("details");
    setMessage("");
  }

 const pageTitle =
  view === "patients"
    ? t("dashboard.workspace", {
        defaultValue: "Patient Management",
      })
    : view === "add"
      ? t("dashboard.addPatient", {
          defaultValue: "Add Patient",
        })
      : t("dashboard.details", {
          defaultValue: "Patient Details",
        });

  return (
    <section
      className={`dashboard-page ${
        embedded ? "dashboard-embedded" : ""
      }`}
      id="dashboard"
    >
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-eyebrow">
  {t("dashboard.eyebrow")}
</p>

            <h2 className="dashboard-title">
              {pageTitle}
            </h2>

            <p className="dashboard-description">
              {t("dashboard.description", {
                defaultValue:
                  "Manage patient records and imaging files.",
              })}
            </p>
          </div>

          {view !== "add" && (
            <button
              type="button"
              className="primary-button"
              onClick={() => chooseView("add")}
            >
              <span>+</span>{" "}
              {t("dashboard.addPatient", {
                defaultValue: "Add Patient",
              })}
            </button>
          )}
        </header>

        {message && (
          <div className="dashboard-message" role="status">
            {message}
          </div>
        )}

        {view === "patients" && (
          <>
            <div className="dashboard-stats">
              <article className="stat-card">
                <div className="stat-top">
                  <span>
                    {t("dashboard.totalPatients", {
                      defaultValue: "Total Patients",
                    })}
                  </span>
                  <span className="stat-icon">
                    <Users size={19} />
                  </span>
                </div>
                <strong>{patients.length}</strong>
                <small>
                  {t("dashboard.patientRecords", {
                    defaultValue: "Patient Records",
                  })}
                </small>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>
                    {t("dashboard.mriScans", {
                      defaultValue: "MRI Scans",
                    })}
                  </span>
                  <span className="stat-icon">
                    <ScanLine size={19} />
                  </span>
                </div>
                <strong>
                  {
                    patients.filter(
                      (patient) => patient.scan === "MRI"
                    ).length
                  }
                </strong>
                <small>
                  {t("dashboard.mriRecords", {
                    defaultValue: "MRI records",
                  })}
                </small>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>
                    {t("dashboard.ctScans", {
                      defaultValue: "CT Scans",
                    })}
                  </span>
                  <span className="stat-icon">
                    <FileImage size={19} />
                  </span>
                </div>
                <strong>
                  {
                    patients.filter(
                      (patient) => patient.scan === "CT"
                    ).length
                  }
                </strong>
                <small>
                  {t("dashboard.ctRecords", {
                    defaultValue: "CT records",
                  })}
                </small>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>
                    {t("dashboard.pendingReview", {
                      defaultValue: "Pending Review",
                    })}
                  </span>
                  <span className="stat-icon">
                    <Activity size={19} />
                  </span>
                </div>
                <strong>
                  {
                    patients.filter(
                      (patient) => patient.status === "Pending"
                    ).length
                  }
                </strong>
                <small>
                  {t("dashboard.awaitingReview", {
                    defaultValue: "Awaiting review",
                  })}
                </small>
              </article>
            </div>

            <section className="dashboard-panel">
              <div className="panel-heading patients-heading">
                <div>
                  <h3>
                    {t("dashboard.allPatients", {
                      defaultValue: "All Patients",
                    })}
                  </h3>
                  <p>
                    {t("dashboard.searchDescription", {
                      defaultValue:
                        "Search and select a patient to view details.",
                    })}
                  </p>
                </div>

                <label className="search-box">
                  <Search size={18} />
                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder={t("dashboard.searchPlaceholder", {
                      defaultValue: "Search patients...",
                    })}
                    aria-label={t("dashboard.searchPlaceholder", {
                      defaultValue: "Search patients...",
                    })}
                  />

                  {search && (
                    <button
                      type="button"
                      className="search-clear"
                      onClick={() => setSearch("")}
                      aria-label={t("dashboard.clearSearch", {
                        defaultValue: "Clear search",
                      })}
                    >
                      <X size={15} />
                    </button>
                  )}
                </label>
              </div>

              <div className="table-wrap">
                <table className="patients-table">
                  <thead>
                    <tr>
                      <th>
                        {t("dashboard.patient", {
                          defaultValue: "Patient",
                        })}
                      </th>
                      <th>
                        {t("dashboard.recordId", {
                          defaultValue: "Record ID",
                        })}
                      </th>
                      <th>
                        {t("dashboard.age", {
                          defaultValue: "Age",
                        })}
                      </th>
                      <th>
                        {t("dashboard.scanType", {
                          defaultValue: "Scan Type",
                        })}
                      </th>
                      <th>
                        {t("dashboard.status", {
                          defaultValue: "Status",
                        })}
                      </th>
                      <th>
                        {t("dashboard.action", {
                          defaultValue: "Action",
                        })}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>
                          <div className="patient-cell">
                            <span className="patient-avatar">
                              {patient.name
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                            <div>
                              <strong>{patient.name}</strong>
                            </div>
                          </div>
                        </td>

                        <td className="id-cell">
                          {patient.id}
                        </td>
                        <td>{patient.age}</td>
                        <td>{patient.scan}</td>

                        <td>
                          <span className="status-pill">
                            <span className="status-dot" />
                            {patient.status === "Pending"
                              ? t("dashboard.pending", {
                                  defaultValue: "Pending",
                                })
                              : patient.status}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="view-button"
                            onClick={() => openPatient(patient)}
                          >
                            {t("dashboard.viewDetails", {
                              defaultValue: "View Details",
                            })}
                            <ArrowRight size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredPatients.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="empty-state"
                        >
                          {t("dashboard.noMatchingPatients", {
                            defaultValue:
                              "No matching patients found.",
                          })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {view === "add" && (
          <section className="dashboard-panel patient-form-panel">
            <div className="panel-heading">
              <div>
                <h3>
                  {t("dashboard.patientInformation", {
                    defaultValue: "Patient Information",
                  })}
                </h3>
                <p>
                  {t("dashboard.enterPatientInformation", {
                    defaultValue: "Enter patient information.",
                  })}
                </p>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() => chooseView("patients")}
                aria-label={t("dashboard.closeForm", {
                  defaultValue: "Close form",
                })}
              >
                <X size={18} />
              </button>
            </div>

            <form className="patient-form" onSubmit={addPatient}>
              <label>
                {t("dashboard.fullName", {
                  defaultValue: "Full Name",
                })}
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder={t("dashboard.enterPatientName", {
                    defaultValue: "Enter patient name",
                  })}
                />
              </label>

              <div className="form-row">
                <label>
                  {t("dashboard.age", {
                    defaultValue: "Age",
                  })}
                  <input
                    required
                    type="number"
                    min="1"
                    max="120"
                    value={form.age}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        age: event.target.value,
                      })
                    }
                    placeholder={t("dashboard.age", {
                      defaultValue: "Age",
                    })}
                  />
                </label>

                <label>
                  {t("dashboard.scanType", {
                    defaultValue: "Scan Type",
                  })}
                  <select
                    value={form.scan}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        scan: event.target.value,
                      })
                    }
                  >
                    <option value="MRI">MRI</option>
                    <option value="CT">CT</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="DICOM">DICOM</option>
                  </select>
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => chooseView("patients")}
                >
                  {t("dashboard.cancel", {
                    defaultValue: "Cancel",
                  })}
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {t("dashboard.savePatient", {
                    defaultValue: "Save Patient",
                  })}
                </button>
              </div>
            </form>
          </section>
        )}

        {view === "details" && selectedPatient && (
          <section className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h3>{selectedPatient.name}</h3>
                <p>{selectedPatient.id}</p>
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={() => chooseView("patients")}
              >
                <ArrowLeft size={16} />
                {t("dashboard.backToPatients", {
                  defaultValue: "Back to Patients",
                })}
              </button>
            </div>

            <div className="details-grid">
              <div className="detail-box">
                <small>
                  {t("dashboard.recordId", {
                    defaultValue: "Record ID",
                  })}
                </small>
                <strong>{selectedPatient.id}</strong>
              </div>

              <div className="detail-box">
                <small>
                  {t("dashboard.age", {
                    defaultValue: "Age",
                  })}
                </small>
                <strong>{selectedPatient.age}</strong>
              </div>

              <div className="detail-box">
                <small>
                  {t("dashboard.scanType", {
                    defaultValue: "Scan Type",
                  })}
                </small>
                <strong>{selectedPatient.scan}</strong>
              </div>

              <div className="detail-box">
                <small>
                  {t("dashboard.analysisStatus", {
                    defaultValue: "Analysis Status",
                  })}
                </small>
                <strong className="pending-text">
                  {selectedPatient.status === "Pending"
                    ? t("dashboard.pending", {
                        defaultValue: "Pending",
                      })
                    : selectedPatient.status}
                </strong>
              </div>
            </div>

            <div className="imaging-panel">
              <div className="imaging-panel-heading">
                <div className="imaging-heading-icon">
                  <FileImage size={20} />
                </div>
                <div>
                  <h3>
                    {t("dashboard.medicalImagingFiles", {
                      defaultValue: "Medical Imaging Files",
                    })}
                  </h3>
                  <p>
                    {t("dashboard.selectImagingFiles", {
                      defaultValue:
                        "Select DICOM or NIfTI files.",
                    })}
                  </p>
                </div>
              </div>

              <label className="upload-dropzone">
                <UploadCloud size={28} />
                <strong>
                  {t("dashboard.chooseImagingFiles", {
                    defaultValue: "Select imaging files",
                  })}
                </strong>
                <span>.dcm, .dicom, .nii, .nii.gz</span>
                <input
                  type="file"
                  multiple
                  accept=".dcm,.dicom,.nii,.nii.gz,.gz"
                  onChange={(event) =>
                    setFiles(
                      Array.from(event.target.files || [])
                    )
                  }
                />
              </label>

              {files.length > 0 && (
                <div className="selected-files">
                  {files.map((file, index) => (
                    <div
                      className="file-row"
                      key={`${file.name}-${index}`}
                    >
                      <FileImage size={17} />
                      <span>{file.name}</span>
                      <small>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </small>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      setMessage(
                        t("dashboard.analysisNotConnected", {
                          defaultValue:
                            "Analysis is not connected yet. The selected files have not been sent for AI analysis.",
                        })
                      )
                    }
                  >
                    {t("dashboard.prepareAnalysis", {
                      defaultValue: "Prepare Analysis",
                    })}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              <div className="imaging-note">
                <ShieldCheck size={17} />
                <span>
                  {t("dashboard.localFilesNote", {
                    defaultValue:
                      "Files remain in this browser preview.",
                  })}
                </span>
              </div>
            </div>

            <div className="results-placeholder">
              <span className="results-icon">
                <Activity size={22} />
              </span>
              <div>
                <h3>
                  {t("dashboard.aiAnalysis", {
                    defaultValue: "AI Analysis",
                  })}
                </h3>
                <p>
                  {t("dashboard.analysisNotConnected", {
                    defaultValue:
                      "Analysis is not connected yet. The selected files have not been sent for AI analysis.",
                  })}
                </p>
              </div>
              <span className="status-pill">
                {t("dashboard.analysisUnavailable", {
                  defaultValue: "Unavailable",
                })}
              </span>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
