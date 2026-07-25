import { centralDistrictDefinition } from '@/district';
import { DistrictScene, projectDistrict } from '@/presentation';

import styles from './App.module.css';

export function App() {
  const projectionResult = projectDistrict(centralDistrictDefinition);

  if (!projectionResult.ok) {
    return <main className={styles.error}>{projectionResult.error.message}</main>;
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>AI City Digital Twin</p>
        <h1>{projectionResult.value.label}</h1>
        <p className={styles.description}>Static baseline district view</p>
      </header>
      <DistrictScene projection={projectionResult.value} />
    </main>
  );
}
