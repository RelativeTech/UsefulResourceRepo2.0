// This snippet file was generated by processing the source file:
// ./firestore-next/test.firestore.js
//
// To make edits to the snippets in this file, please edit the source

// [START cities_document_set_modular]
import { doc, setDoc } from "firebase/firestore"; 

await setDoc(doc(db, "cities", "new-city-id"), data);
// [END cities_document_set_modular]