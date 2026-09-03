declare module '@react-native-firebase/database' {
  import type { Database, DataSnapshot, DatabaseReference } from '@react-native-firebase/database/dist/typescript/lib/types/database';

  interface FirebaseDatabaseTypesNamespace {
    Database: typeof Database;
    DataSnapshot: DataSnapshot;
    DatabaseReference: DatabaseReference;
  }

  const database: () => Database;
  const FirebaseDatabaseTypes: FirebaseDatabaseTypesNamespace;

  export default database;
  export { FirebaseDatabaseTypes };
}
