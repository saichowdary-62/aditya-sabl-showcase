import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About SABL</h1>
      <p className="mb-4">
        Student-Based Learning (SABL) is an innovative educational approach that places students at the center of the learning process. It encourages active participation, critical thinking, and collaborative skills. Through SABL, students take ownership of their education, fostering a deeper understanding of subjects and developing essential life skills.
      </p>
      <h2 className="text-2xl font-bold mb-4">SABL at Aditya University</h2>
      <p className="mb-4">
        Aditya University has embraced Student-Based Learning (SABL) to provide a dynamic and engaging educational experience. Our SABL activities are designed to complement the traditional curriculum, offering students opportunities to apply their knowledge in practical scenarios. These activities include project-based learning, case studies, group discussions, and interactive workshops, all aimed at enhancing the learning process and preparing students for future challenges.
      </p>
      <a href="/SABL_Grading_Points_Overview.pdf" download>
        <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
          Download Grading Points Overview
        </button>
      </a>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">SABL Activities in Action</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <img src="https://images.unsplash.com/photo-1712903911017-7c10a3c4b3e5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3R1ZGVudCUyMHByZXNlbnRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D" alt="SABL Project" className="rounded-lg shadow-md" />
          <img src="https://images.unsplash.com/photo-1660795863766-cc0ee743185b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3R1ZGVudCUyMHByZXNlbnRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D" alt="Group Discussion" className="rounded-lg shadow-md" />
          <img src="https://images.unsplash.com/photo-1646579886135-068c73800308?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3R1ZGVudCUyMHByZXNlbnRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D" alt="Workshop" className="rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default About;
