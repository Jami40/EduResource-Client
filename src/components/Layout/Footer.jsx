import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
      <nav className="grid grid-flow-col gap-4">
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Privacy Policy</a>
        <a className="link link-hover">Terms of Service</a>
      </nav> 
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a>
            <BookOpen size={24} />
          </a>
        </div>
      </nav> 
      <aside>
        <p>Copyright © 2024 - All rights reserved by EduResource</p>
      </aside>
    </footer>
  );
};

export default Footer; 