const Footer: React.FC = () => {
    return (
      <footer className="bg-gray-800 text-white p-6 text-center">
        <p>&copy; 2024 PhoneKlinik. Alle rettigheder forbeholdt.</p>
        <p>
          Kontakt os:{' '}
          <a href="mailto:info@phoneklinik.dk" className="underline">
            info@phoneklinik.dk
          </a>
        </p>
      </footer>
    );
  };
  
  export default Footer;
  