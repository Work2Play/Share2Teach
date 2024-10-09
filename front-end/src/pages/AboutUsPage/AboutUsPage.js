import React, { useState, useEffect } from 'react';
import './AboutUsPage.css';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Adjust this path to your firebase config file
import Chantelle from '../../Images/Chantelle.jpg';
import Dorothy from '../../Images/Dorothy.jpg';
import NWU_UNESCO from '../../Images/NWU&UNESCO.png';


//contribute stuff
import { Upload } from '../../components/fileupload';



function AboutUsPage() {
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
        <div className="about-us-page">
        <div className="about-us-content">
            <h1>About Us</h1>
            <p>
            Welcome to Share2Teach, a vibrant open educational resource (OER) project designed to foster a global community of learners and educators. At the heart of our initiative is the belief that knowledge should be accessible, collaborative, and free. Share2Teach is a testament to the power of collective effort, co-created by the innovative minds of students under the guidance of their facilitators.
            </p>
            <p>
            The project was founded by Dr Chantelle Bosch, a dedicated lecturer and the sub-area leader for <em>Blended Learning to Enhance Self-Directed Learning</em> within the Research Unit Self-Directed Learning at the North-West University (NWU). Alongside her, Prof. Dorothy Laubscher, the chairholder of the UNESCO Chair on Multimodal Learning and OER, has been instrumental in shaping the vision and direction of Share2Teach.
            </p>
            <p>
            Together, they have nurtured a platform where diverse educational resources come to life, crafted by students for students. From comprehensive semester planning documents to topic-specific insights, Share2Teach offers a wide array of materials tailored to enhance self-directed learning through cooperative learning and project-based teaching strategies.
            </p>
            <p>
            Share2Teach stands as a beacon for educational innovation, inviting educators and learners worldwide to contribute, explore, and grow within this open, inclusive community. Join us in our journey to make learning a shared adventure, breaking down barriers and building bridges towards a more knowledgeable and connected world.
            </p>
            <h2>Contributing to Share2Teach</h2>
            <p>
            If you're a teacher or lecturer passionate about education and eager to make a difference, we invite you to join our collaborative community. Share2Teach is always looking for educators who are willing to contribute their knowledge and expertise to enrich our platform. Whether you have comprehensive course materials, innovative teaching strategies, or insightful educational resources, your contribution can significantly impact learners worldwide.
            </p>
            <p>
            To become a part of this transformative educational journey, please reach out to us. We welcome your interest in sharing your resources and ideas, and we are excited about the possibility of working together to expand the horizons of open education. Contact us to explore how you can contribute to the Share2Teach project and help shape the future of learning. Click on the link below to contribute a resource.
            </p>
            {(role === 'educator' || role === 'moderator' || role === 'admin') && (
                <button onClick={() => setContriOpen(true)}>Contribute Resources</button>
            )}
                <Upload isOpen={contriOpen} onClose={() => setContriOpen(false)} />
        </div>
        <div className="contact-info">
            <h2>Contact Information</h2>
            <div className="contact-item">
            <img src={Chantelle} alt="Dr Chantelle Bosch" />
            <div>
                <p><strong>Dr Chantelle Bosch</strong></p>
                <p><a href="mailto:Chantelle.Bosch@nwu.ac.za">Chantelle.Bosch@nwu.ac.za</a></p>
                <p>+27 (018) 299 4768</p>
            </div>
            </div>
            <div className="contact-item">
            <img src={Dorothy} alt="Prof Dorothy Laubscher" />
            <div>
                <p><strong>Prof Dorothy Laubscher</strong></p>
                <p><a href="mailto:Dorothy.Laubscher@nwu.ac.za">Dorothy.Laubscher@nwu.ac.za</a></p>
                <p>+27 (018) 299 4785</p>
            </div>
            </div>
        </div>
        <div className="image-container">
            <img src={NWU_UNESCO} alt="NWU and UNESCO" className="nwu-unesco-image" />
        </div>
        </div>
    );
}

export default AboutUsPage;
