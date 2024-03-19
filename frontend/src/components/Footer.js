import React from 'react';



export default function Footer() {
  return (
    <footer className='bg-dark text-white text-center'>
      <p>&copy; {new Date().getFullYear()} Sentiment Analysis for Search Result Snippets</p>
    </footer>
  );
}
