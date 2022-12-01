import { Timestamp } from "firebase/firestore";

export const firebaseTimestampsConverter = {
    toFirestore: function(doc) {
        return  {
                ...doc,
                createdAt: doc.createdAt ? 
                    Timestamp.fromDate(doc.createdAt instanceof Date ? doc.createdAt :  new Date(doc.createdAt))
                    :
                    Timestamp.now(),
                updatedAt: Timestamp.now(),
                created: doc.created ? 
                    Timestamp.fromDate(doc.created instanceof Date ? doc.created :  new Date(doc.created))
                    :
                    Timestamp.now(),
            }
    },
    fromFirestore: function(snapshot){
        const data = snapshot.data();
        if(data){
            if(data.createdAt)
                data.createdAt = (data.createdAt as Timestamp).toDate().toString();
            if(data.created)
                data.created = data.created.toDate().toString();
            if(data.updatedAt)
                data.updatedAt = data.updatedAt.toDate().toString();
        }
        return data;
    }
}

export const setUpdatedTimestamp = (doc: any)=> {
    doc.updatedAt = Timestamp.now()
    return doc;
}

export const setTimestampToISO = (doc: any) =>{
    if(doc.createdAt)
        doc.createdAt = doc.createdAt.toDate().toISOString()
    if(doc.updatedAt)
        doc.updatedAt = doc.updatedAt.toDate().toISOString()
}
