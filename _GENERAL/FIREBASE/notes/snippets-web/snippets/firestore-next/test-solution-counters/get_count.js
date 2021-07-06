// This snippet file was generated by processing the source file:
// ./firestore-next/test.solution-counters.js
//
// To make edits to the snippets in this file, please edit the source

// [START get_count_modular]
async function getCount(ref) {
    import { collection, getDocs } from "firebase/firestore";

    // Sum the count of each shard in the subcollection
    const snapshot = await getDocs(collection(ref, 'shards'));

    let totalCount = 0;
    snapshot.forEach((doc) => {
        totalCount += doc.data().count;
    });

    return totalCount;
}
// [END get_count_modular]