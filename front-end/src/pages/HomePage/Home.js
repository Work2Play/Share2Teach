import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Adjust this path to your firebase config file
import './Home.css';
import Logo from '../../Images/logo.png';
import Background from '../../Images/share-teacher-incentive-idea.jpg';

//contribute stuff
import { Upload } from '../../components/fileupload';

function Home() {
    const [contriOpen, setContriOpen] = useState(false);
    const [role, setRole] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                    const docRef = doc(db, 'users', user.uid); // Assuming you store user roles in Firestore
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setRole(docSnap.data().role); // Set the role from the Firestore document
                    } else {
                        console.log('No such document!');
                    }
                } else {
                    console.log('No user is logged in');
                }
            } catch (error) {
                console.error('Error fetching user role: ', error);
            }
        };

        fetchUserRole();
    }, []);

    return (
        <div className="home-page">
        <div className="hero-image">
        <img src={Background} alt="share-teacher-incentive-idea" className="background-logo" />
            <h1>Share2Teach</h1>
            <h2>Open Educational Resources</h2>
            

            {(role === 'moderator' || role === 'admin') && (          
                <Link to="/moderation" className="moderation-link">Go to Moderation</Link>            
            )}

            {(role === 'admin') && (         
                <Link to="/role-assign" className="roleassign-link">Role Assign</Link>
            )}

            {(role === 'educator' || role === 'moderator' || role === 'admin') && (
                <button onClick={() => setContriOpen(true)}>Contribute Resources</button>
            )}
                <Upload isOpen={contriOpen} onClose={() => setContriOpen(false)} />
        </div>

            <h2>Available Subjects and More:</h2>

        <div className="subject-gallery">
            <div className="subject-card">
            <Link to="/mathematics">Mathematics</Link>
            </div>
            <div className="subject-card">
            <Link to="/business-studies">Business Studies</Link>
            </div>
            <div className="subject-card">
            <Link to="/history">History</Link>
            </div>
            <div className="subject-card">
            <Link to="/geography">Geography</Link>
            </div>
            <div className="subject-card">
            <Link to="/natural-science">Natural Science</Link>
            </div>
            <div className="subject-card">
            <Link to="/life-science">Life Science</Link>
            </div>
            <div className="subject-card">
            <Link to="/english">English</Link>
            </div>
            <div className="subject-card">
            <Link to="/technology">Technology</Link>
            </div>
            <div className="subject-card">
            <Link to="/afrikaans">Afrikaans</Link>
            </div>
            <div className="subject-card">
            <Link to="/life-skills">Life Skills</Link>
            </div>
            <div className="subject-card">
            <Link to="/computer-science">Computer Science</Link>
            </div>
            <div className="subject-card">
            <Link to="/other-oers">Other useful OER's</Link>
            </div>
            <div className="subject-card">
            <Link to="/self-directed-learning">Self-Directed Learning</Link>
            </div>
            <div className="subject-card">
            <Link to="/contributors">Contributors</Link>
            </div>
            <div className="subject-card">
            <Link to="/about-us">About Us</Link>
            </div>
        </div>
        <div className="logo-container">
            <img src={Logo} alt="Logo" className="home-logo" />
        </div>
        </div>
    );
}

export default Home;