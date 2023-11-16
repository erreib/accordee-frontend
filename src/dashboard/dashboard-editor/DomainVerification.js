import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const DomainVerification = ({ username, backendUrl, userId }) => {
  // State variables
  const [verificationToken, setVerificationToken] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // State to track loading status

  // function to fetch verification details from the backend
  const fetchVerificationDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/${username}/get-verification-details`);
      setVerificationToken(response.data.verificationToken);
      setCustomDomain(response.data.customDomain);
      setIsVerified(response.data.isVerified);  // No change needed here
    } catch (error) {
      console.error('Failed to fetch verification details:', error);
    }
  }, [backendUrl, username]);  // Dependencies  

  useEffect(() => {
    fetchVerificationDetails();
  }, [fetchVerificationDetails]);  // Updated dependency array
  
  const handleGenDomainVerification = async () => {
    // Generate a unique token for verification.
    const token = Math.random().toString(36).substr(2, 9);
    setVerificationToken(token);

    try {
      // Use the user object to send the user ID and verification token to your backend
      const response = await axios.post(`${backendUrl}/${username}/generate-verification-token`, {
        userId,  // Use 'id' to align with your UserContext field
        verificationToken: token,
        customDomain,  // Include customDomain here
      });

      if (response.data.success) {
        setIsVerified(false);  // Reset the verification status on the frontend
        // Maybe show a success message to the user that the token was generated
      } else {
        // Show an error message to the user
      }
    } catch (error) {
      console.error('Failed to generate verification token:', error);
      // Show an error message to the user
    }
    fetchVerificationDetails();
  };

  const handleVerifyDNS = async () => {
    setIsLoading(true);  // Start loading
    try {
      // Use the user object to send the user ID to your backend
      const response = await axios.post(`${backendUrl}/${username}/verify-dns`, {
        userId,  // Use 'id' to align with your UserContext field
      });

      if (response.data.success) {
        setIsVerified(true);  // Domain is verified
        // Maybe show a success message to the user
      } else {
        setIsVerified(false);  // Domain verification failed
        // Show an error message to the user
      }
    } catch (error) {
      setIsVerified(false);  // An error occurred, so consider it as a failed verification
      console.error('Failed to verify DNS:', error);
      // Show an error message to the user
    } finally {
      setIsLoading(false);  
    }
    fetchVerificationDetails();
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Custom Domain"
          value={customDomain}
          onChange={e => setCustomDomain(e.target.value)}
        />
        <button onClick={handleGenDomainVerification}>Generate Verification Token</button>
      </div>

      {verificationToken && (
        <div>
          <p>Please add the following TXT record to your DNS settings to verify domain ownership:</p>
          <code>{verificationToken}</code>
          <button onClick={handleVerifyDNS}>Verify Domain</button>
          {isLoading && <p>Loading...</p>}
        </div>
      )}

      {isVerified && <p>Domain verified!</p>}
    </div>
  );
};

export default DomainVerification;