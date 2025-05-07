import { useState } from "react";

export default function AdminProfileSettingPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState({
    personalizedOffers: true,
    onlineWebinars: true,
    newFeatures: true,
    securityBilling: false,
    marketing: false,
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleStyle = (checked) => ({
    position: "relative",
    display: "inline-block",
    width: "40px",
    height: "22px",
    backgroundColor: checked ? "#007bff" : "#ccc",
    borderRadius: "22px",
    transition: "0.4s",
    cursor: "pointer",
  });

  const toggleCircleStyle = (checked) => ({
    position: "absolute",
    height: "16px",
    width: "16px",
    left: checked ? "21px" : "3px",
    bottom: "3px",
    backgroundColor: "white",
    borderRadius: "50%",
    transition: "0.4s",
  });

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      background: "#ffffff",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    tabsList: {
      display: "flex",
      gap: "15px",
      marginBottom: "20px",
      borderBottom: "2px solid #ddd",
      paddingBottom: "5px",
    },
    tabTrigger: (isActive) => ({
      padding: "10px 15px",
      cursor: "pointer",
      border: "none",
      background: "none",
      fontSize: "16px",
      fontWeight: "500",
      borderBottom: isActive ? "3px solid #007bff" : "none",
      color: isActive ? "#007bff" : "#000",
    }),
    card: {
      background: "#f8f9fa",
      padding: "20px",
      borderRadius: "8px",
    },
    fileUploadContainer: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "20px",
    },
    filePreview: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover",
      background: "#ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      fontWeight: "bold",
    },
    inputGroup: {
      display: "flex",
      gap: "10px",
      marginBottom: "15px",
    },
    input: {
      flex: 1,
      padding: "8px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      fontSize: "14px",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "20px",
    },
    button: (isPrimary) => ({
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      background: isPrimary ? "#007bff" : "#ccc",
      color: isPrimary ? "white" : "black",
    }),
    notificationItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid #eee",
    },
    notificationText: {
      margin: 0,
      color: "#666",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Settings</h2>

      <div style={styles.tabsList}>
        {["profile", "notifications", "accounts", "security"].map((tab) => (
          <button
            key={tab}
            style={styles.tabTrigger(activeTab === tab)}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {activeTab === "profile" && (
        <div style={styles.card}>
          <h3>Profile Details</h3>
          <p>Enter your profile information</p>

          <div style={styles.fileUploadContainer}>
            <div style={styles.filePreview}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" style={styles.filePreview} />
              ) : (
                "+"
              )}
            </div>
            <input type="file" id="fileUpload" hidden onChange={handleFileUpload} />
            <label htmlFor="fileUpload" style={{ ...styles.button(true), cursor: "pointer" }}>
              Add File
            </label>
            {profileImage && (
              <button onClick={handleRemoveImage} style={styles.button(false)}>
                Remove Image
              </button>
            )}
          </div>

          <div style={styles.inputGroup}>
            <input type="text" placeholder="First Name" style={styles.input} />
            <input type="text" placeholder="Last Name" style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <input type="email" placeholder="Email Address" style={styles.input} />
            <input type="tel" placeholder="Phone Number" style={styles.input} />
          </div>

          <h4>Regional Settings</h4>
          <div style={styles.inputGroup}>
            <select style={styles.input}>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
            </select>
            <select style={styles.input}>
              <option value="gmt+2">GMT +02:00</option>
              <option value="gmt+5">GMT +05:00</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button style={styles.button(false)}>Cancel</button>
            <button style={styles.button(true)}>Save</button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
  
{activeTab === "accounts" && (
  <div style={styles.card}>
    <h3>Notification Settings</h3>

    {[
      { key: "personalizedOffers", title: "Personalized Offers", description: "Receive offers made special for you" },
      { key: "onlineWebinars", title: "Online Webinars", description: "Get notified about upcoming webinars" },
      { key: "newFeatures", title: "New Features", description: "Updates about new features and product releases" },
      { key: "securityBilling", title: "Security and Billing", description: "Account security and notifications about billing" },
      { key: "marketing", title: "Marketing", description: "Receive marketing newsletters about our new products." }
    ].map((item) => (
      <div key={item.key} style={styles.notificationItem}>
        <div>
          <strong>{item.title}</strong>
          <p style={styles.notificationText}>{item.description}</p>
        </div>
        <div
          onClick={() => handleNotificationChange(item.key)}
          style={toggleStyle(notifications[item.key])}
        >
          <div style={toggleCircleStyle(notifications[item.key])}></div>
        </div>
      </div>
    ))}

    {/* Add Cancel and Save buttons here */}
    <div style={styles.buttonGroup}>
      <button style={styles.button(false)}>Cancel</button>
      <button style={styles.button(true)}>Save</button>
    </div>
  </div>
)}
      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div style={styles.card}>
          <h3>Profile Details</h3>
          <p>Enter your profile information</p>

          <div style={styles.fileUploadContainer}>
            <div style={styles.filePreview}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" style={styles.filePreview} />
              ) : (
                "+"
              )}
            </div>
            <input type="file" id="fileUpload" hidden onChange={handleFileUpload} />
            <label htmlFor="fileUpload" style={{ ...styles.button(true), cursor: "pointer" }}>
              Add File
            </label>
            {profileImage && (
              <button onClick={handleRemoveImage} style={styles.button(false)}>
                Remove Image
              </button>
            )}
          </div>

          <div style={styles.inputGroup}>
            <input type="text" placeholder="First Name" style={styles.input} />
            <input type="text" placeholder="Last Name" style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <input type="email" placeholder="Email Address" style={styles.input} />
            <input type="tel" placeholder="Phone Number" style={styles.input} />
          </div>

          <h4>Regional Settings</h4>
          <div style={styles.inputGroup}>
            <select style={styles.input}>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
            </select>
            <select style={styles.input}>
              <option value="gmt+2">GMT +02:00</option>
              <option value="gmt+5">GMT +05:00</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button style={styles.button(false)}>Cancel</button>
            <button style={styles.button(true)}>Save</button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
  
{activeTab === "notifications" && (
  <div style={styles.card}>
    <h3>Notification Settings</h3>

    {[
      { key: "personalizedOffers", title: "Personalized Offers", description: "Receive offers made special for you" },
      { key: "onlineWebinars", title: "Online Webinars", description: "Get notified about upcoming webinars" },
      { key: "newFeatures", title: "New Features", description: "Updates about new features and product releases" },
      { key: "securityBilling", title: "Security and Billing", description: "Account security and notifications about billing" },
      { key: "marketing", title: "Marketing", description: "Receive marketing newsletters about our new products." }
    ].map((item) => (
      <div key={item.key} style={styles.notificationItem}>
        <div>
          <strong>{item.title}</strong>
          <p style={styles.notificationText}>{item.description}</p>
        </div>
        <div
          onClick={() => handleNotificationChange(item.key)}
          style={toggleStyle(notifications[item.key])}
        >
          <div style={toggleCircleStyle(notifications[item.key])}></div>
        </div>
      </div>
    ))}

    {/* Add Cancel and Save buttons here */}
    <div style={styles.buttonGroup}>
      <button style={styles.button(false)}>Cancel</button>
      <button style={styles.button(true)}>Save</button>
    </div>
  </div>
)}
{activeTab === "security" && (
  <div style={styles.card}>
    <h3>Notification Settings</h3>

    {[
      { key: "personalizedOffers", title: "Personalized Offers", description: "Receive offers made special for you" },
      { key: "onlineWebinars", title: "Online Webinars", description: "Get notified about upcoming webinars" },
      { key: "newFeatures", title: "New Features", description: "Updates about new features and product releases" },
      { key: "securityBilling", title: "Security and Billing", description: "Account security and notifications about billing" },
      { key: "marketing", title: "Marketing", description: "Receive marketing newsletters about our new products." }
    ].map((item) => (
      <div key={item.key} style={styles.notificationItem}>
        <div>
          <strong>{item.title}</strong>
          <p style={styles.notificationText}>{item.description}</p>
        </div>
        <div
          onClick={() => handleNotificationChange(item.key)}
          style={toggleStyle(notifications[item.key])}
        >
          <div style={toggleCircleStyle(notifications[item.key])}></div>
        </div>
      </div>
    ))}

    {/* Add Cancel and Save buttons here */}
    <div style={styles.buttonGroup}>
      <button style={styles.button(false)}>Cancel</button>
      <button style={styles.button(true)}>Save</button>
    </div>
  </div>
)}

    </div>
  );
}
