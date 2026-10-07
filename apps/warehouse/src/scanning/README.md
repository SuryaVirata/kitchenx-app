# scanning

A `Scanner` interface used by goods-receipt, picking, dispatch and offline-sale. The first implementation uses the phone camera (QR and barcodes). A hardware-scanner implementation (for example rugged Android devices) can be added later without changing features. A debug implementation lets E2E tests inject scans.

Open question: barcode/QR standards and warehouse device models.
