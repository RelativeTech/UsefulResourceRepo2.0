<a name="module_fbstorage"></a>

## fbstorage
Interface to Google Cloud Storage in the security context of the authenticated user. Keep track of every file add/remove in firestore becausefirebase cloud storage does not allow listing/searching for files.Use the REST API directly because the node.js interface does not include storage.After initialization the fbstorage module will contain 3 objects:* .file - file access limited to the current signed-in user* .app - file access limited to any user of this app but not other apps* .public - file access without restriction

**See**

- [Firebase Storage](https://firebase.google.com/docs/storage/)
- [Object Naming Guidelines](https://cloud.google.com/storage/docs/naming#objectnames)

**Example**  
```js
const { fbstorage } = require( 'electron-firebase' )// get list of folders only accessible to the signed-in userconst fileFolderList = await fbstorage.file.folders()
```

* [fbstorage](#module_fbstorage)
    * [initialize()](#exp_module_fbstorage--initialize) ⏏
        * [~fileStore](#module_fbstorage--initialize..fileStore)
            * [new fileStore(firestoreRoot, storeName, setPrefix)](#new_module_fbstorage--initialize..fileStore_new)
            * [.find(filepath, queryMatch)](#module_fbstorage--initialize..fileStore+find) ⇒ <code>object</code>
            * [.list(folderpath, queryMatch)](#module_fbstorage--initialize..fileStore+list) ⇒ <code>object</code>
            * [.folders(filepath, content)](#module_fbstorage--initialize..fileStore+folders)
            * [.upload(filepath, content)](#module_fbstorage--initialize..fileStore+upload) ⇒ <code>object</code>
            * [.update(filepath, metadata)](#module_fbstorage--initialize..fileStore+update) ⇒ <code>object</code>
            * [.download(filepath)](#module_fbstorage--initialize..fileStore+download) ⇒ <code>string</code> \| <code>JSON</code> \| <code>buffer</code> \| <code>object</code> \| <code>array</code>
            * [.about(filepath)](#module_fbstorage--initialize..fileStore+about) ⇒ <code>Promise</code>
            * [.delete(filepath)](#module_fbstorage--initialize..fileStore+delete) ⇒ <code>null</code> \| <code>string</code>

<a name="exp_module_fbstorage--initialize"></a>

### initialize() ⏏
Firebase Storage interfaces are defined when your app starts (this functionmust be called after firestore is initialized).

**Kind**: Exported function  
<a name="module_fbstorage--initialize..fileStore"></a>

#### initialize~fileStore
**Kind**: inner class of [<code>initialize</code>](#exp_module_fbstorage--initialize)  

* [~fileStore](#module_fbstorage--initialize..fileStore)
    * [new fileStore(firestoreRoot, storeName, setPrefix)](#new_module_fbstorage--initialize..fileStore_new)
    * [.find(filepath, queryMatch)](#module_fbstorage--initialize..fileStore+find) ⇒ <code>object</code>
    * [.list(folderpath, queryMatch)](#module_fbstorage--initialize..fileStore+list) ⇒ <code>object</code>
    * [.folders(filepath, content)](#module_fbstorage--initialize..fileStore+folders)
    * [.upload(filepath, content)](#module_fbstorage--initialize..fileStore+upload) ⇒ <code>object</code>
    * [.update(filepath, metadata)](#module_fbstorage--initialize..fileStore+update) ⇒ <code>object</code>
    * [.download(filepath)](#module_fbstorage--initialize..fileStore+download) ⇒ <code>string</code> \| <code>JSON</code> \| <code>buffer</code> \| <code>object</code> \| <code>array</code>
    * [.about(filepath)](#module_fbstorage--initialize..fileStore+about) ⇒ <code>Promise</code>
    * [.delete(filepath)](#module_fbstorage--initialize..fileStore+delete) ⇒ <code>null</code> \| <code>string</code>

<a name="new_module_fbstorage--initialize..fileStore_new"></a>

##### new fileStore(firestoreRoot, storeName, setPrefix)
Create a new fileStore interface.


| Param | Type | Description |
| --- | --- | --- |
| firestoreRoot | <code>string</code> | a database object defined in firestore.js |
| storeName | <code>string</code> | just a moniker |
| setPrefix | <code>string</code> | the first two segments of the file path, e.g. user/userid |

<a name="module_fbstorage--initialize..fileStore+find"></a>

##### fileStore.find(filepath, queryMatch) ⇒ <code>object</code>
Search the storage records in the Firestore database for a file matching the specific filepath given. The newest document matching the search criteria will be returned.

**Kind**: instance method of [<code>fileStore</code>](#module_fbstorage--initialize..fileStore)  
**Returns**: <code>object</code> - - metafile descriptor for the requested file  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filepath | <code>string</code> |  | Path and filename to store the file in the Cloud |
| queryMatch | <code>string</code> | <code>&quot;path&quot;</code> | optional match parameter to query for something other than path |

<a name="module_fbstorage--initialize..fileStore+list"></a>

##### fileStore.list(folderpath, queryMatch) ⇒ <code>object</code>
Search the storage records in the Firestore database for all files where their folder matches the specific path given, and return an array with the metadata for each file.

**Kind**: instance method of [<code>fileStore</code>](#module_fbstorage--initialize..fileStore)  
**Returns**: <code>object</code> - - metafile descriptor for the requested file  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| folderpath | <code>string</code> |  | Path to query file storage |
| queryMatch | <code>string</code> | <code>&quot;folder&quot;</code> | optional match parameter to query for something other than folder |

<a name="module_fbstorage--initialize..fileStore+folders"></a>

##### fileStore.folders(filepath, content)
Return a list of all folders. Folders don't really exist, they are just a slash-separated path construct, the parent of the file path.

**Kind**: instance method of [<code>fileStore</code>](#module_fbstorage--initialize..fileStore)  

| Param | Type |
| --- | --- |
| filepath | <code>\*</code> | 
| content | <code>\*</code> | 

<a name="module_fbstorage--initialize..fileStore+upload"></a>

##### fileStore.upload(filepath, content) ⇒ <code>object</code>
Uploads local content and creates a file in Google Cloud Storage for Firebase, and a record of the file will be kept in the Cloud Firestore database, for easy reference and searching. Accepts contents as string, JSON string, object (serializable), array, or buffer. Returns a Promise containing file metadata, as:

**Kind**: instance method of [<code>fileStore</code>](#module_fbstorage--initialize..fileStore)  
**Returns**: <code>object</code> - - metafile descriptor for the requested file  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | Path and filename to store the file in the Cloud |
| content | <code>string</code> \| <code>JSON</code> \| <code>buffer</code> \| <code>object</code> \| <code>array</code> | File content to be written, objects must be serializable |

**Example**  
```js
{ name: 'users/[user-id]/Test/FileTest',  bucket: 'your-app-here.appspot.com',  generation: '123456789123456',  metageneration: '1',  contentType: 'application/json',  timeCreated: '2019-02-05T03:06:24.435Z',  updated: '2019-02-05T03:06:24.435Z',  storageClass: 'STANDARD',  size: '1005',  md5Hash: 'H3Anb534+vX2Y1HVwJxlyw==',  contentEncoding: 'identity',  contentDisposition: 'inline; filename*=utf-8\'\'FileTest',  crc32c: 'yTf15w==',  etag: 'AAAAAAA=',  downloadTokens: '00000000' }
```
<a name="module_fbstorage--initialize..fileStore+update"></a>

##### fileStore.update(filepath, metadata) ⇒ <code>object</code>
Change some metadata aspects of a stored file

**Kind**: instance method of [<code>fileStore</code>](#module_fbstorage--initialize..fileStore)  
**Returns**: <code>object</code> - - metafile descriptor for the requested file  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | Path and filename to update the file in the Cloud, relative to the current user |
| metadata |  | One or more metadata parameters to change |
| metadata.cacheControl | <code>string</code> | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control |
| metadata.contentDisposition | <code>string</code> | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/content-Disposition |
| metadata.contentEncoding | <code>string</code> | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding |
| metadata.contentLanguage | <code>string</code> | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language |
| metadata.contentType | <code>string</code> | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type |

<a name="module_fbstorage--initialize..fileStore+download"></a>

##### fileStore.download(filepath) ⇒ <code>string</code> \| <code>JSON</code> \| <code>buffer</code> \| <code>object</code> \| <code>array</code>
Download a file from Firebase Storage

**Kind**: instance method of [<code>fileStore</code>](#module_fbstorage--initialize..fileStore)  
**Returns**: <code>string</code> \| <code>JSON</code> \| <code>buffer</code> \| <code>object</code> \| <code>array</code> - - file content  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | Path and filename to retreive the file |

<a name="module_fbstorage--initialize..fileStore+about"></a>

##### fileStore.about(filepath) ⇒ <code>Promise</code>
Gets meta information about the file, including a secure download URL that can be used anywhere

**Kind**: instance method of [<code>fileStore</code>](#module_fbstorage--initialize..fileStore)  
**Returns**: <code>Promise</code> - A Promise object representing the meta information about the file  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | Path and filename to find the file in the Cloud, relative to the current user |

<a name="module_fbstorage--initialize..fileStore+delete"></a>

##### fileStore.delete(filepath) ⇒ <code>null</code> \| <code>string</code>
Delete the file from Google Cloud Storage for Firebase and remove the file's record from Cloud Firestore

**Kind**: instance method of [<code>fileStore</code>](#module_fbstorage--initialize..fileStore)  
**Returns**: <code>null</code> \| <code>string</code> - - empty response unless there is an error  

| Param | Type | Description |
| --- | --- | --- |
| filepath | <code>string</code> | Path and filename to delete the file in the Cloud, relative to the current user |

