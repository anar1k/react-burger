import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { Home } from '@pages/Home';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  return (
    <div className={styles.app}>
      <AppHeader />

      <main className={styles.main}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
};

export default App;
