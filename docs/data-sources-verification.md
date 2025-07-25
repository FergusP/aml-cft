# Sumber Data dan Verifikasi untuk Proposal BI-OJK Hackathon 2025

## Data Faktual yang Digunakan dalam Proposal (Updated)

### 1. Data Investor Kripto Indonesia
**Claim**: 21.27 juta investor kripto terdaftar di Indonesia (BAPPEBTI, Oktober 2024)
- **Sumber**: BAPPEBTI Press Release Oktober 2024
- **Link Verifikasi**: https://kripto.bappebti.go.id/berita/bappebti-jumlah-pelanggan-aset-kripto-di-indonesia-tembus-21-27-juta
- **Alternatif**: Pojok Media Kemendag https://www.kemendag.go.id/pojok-media?tag=kripto

### 2. Volume Perdagangan Kripto
**Claim**: Volume perdagangan kripto mencapai Rp 211 triliun (Jan-April 2024)
- **Sumber**: BAPPEBTI Report April 2024
- **Link Verifikasi**: https://kripto.bappebti.go.id/berita/transaksi-kripto-indonesia-sentuh-rp-211-triliun-hingga-april-2024
- **Verifikasi**: Data aggregat dari 13 exchange berlisensi BAPPEBTI

### 3. Global Crypto Crime Statistics
**Claim**: $23.8 miliar dicuci melalui crypto globally (Chainalysis, 2024)
- **Sumber**: Chainalysis Crypto Crime Report 2024
- **Blog Post**: https://www.chainalysis.com/blog/2024-crypto-crime-report-introduction/
- **Download Report**: https://go.chainalysis.com/rs/503-FAP-074/images/Crypto_Crime_Report_2024.pdf

### 4. Data PPATK & Kemenkeu
**Claim**: Laporan transaksi mencurigakan dan data fiskal
- **Sumber**: Laporan Tahunan BKF Kemenkeu 2022
- **Link**: https://fiskal.kemenkeu.go.id/files/laporan-tahunan/file/laptah-bkf-2022.pdf
- **LKPP**: https://djpb.kemenkeu.go.id/direktorat/akuntansi/id/laporan-keuangan.html

### 5. Regulasi Terbaru BAPPEBTI
**Peraturan BAPPEBTI No 9 Tahun 2024**
- **Tentang**: Penyelenggaraan Perdagangan Fisik Aset Kripto
- **Link**: https://jdih.kemendag.go.id/pdf/Regulasi/103815_9_TAHUN_2024_TTG_PENYELENGGARAAN_PERDAGANGAN_FISIK_ASET_KRIPTO_01112024113644.pdf

### 6. FATF/APG Review Timeline
**Claim**: Indonesia dalam monitoring APG (Asia/Pacific Group on Money Laundering)
- **Sumber**: APG Mutual Evaluations
- **Link**: http://www.apgml.org/mutual-evaluations/page.aspx?p=a901181b-60f6-494c-a79f-0a283b57c30e
- **Note**: Indonesia adalah anggota APG, evaluasi FATF dilakukan melalui APG

## API dan Tools yang Dapat Diakses

### Blockchain Data APIs (Free Tier)
1. **Etherscan API**
   - Link: https://etherscan.io/apis
   - Free: 100,000 requests/day
   - Use: Transaction verification, address labels

2. **Blockchain.com API**
   - Link: https://www.blockchain.com/api
   - Free: Basic endpoints
   - Use: Bitcoin transaction data

3. **CoinGecko API**
   - Link: https://www.coingecko.com/en/api
   - Free: 50 calls/minute
   - Use: Price data, market cap

### Compliance & Sanctions Lists
1. **OFAC SDN List**
   - Link: https://sanctionssearch.ofac.treas.gov/
   - Download: https://www.treasury.gov/ofac/downloads/sdnlist.txt
   - Update: Daily

2. **Chainalysis Free Sanctions Screening**
   - Link: https://www.chainalysis.com/free-cryptocurrency-sanctions-screening-tools/
   - Access: Free registration required

### Indonesian Regulatory Sources
1. **BAPPEBTI**
   - Statistik: https://bappebti.go.id/pbk/statistik
   - Regulasi: https://bappebti.go.id/pbk/regulasi

2. **Bank Indonesia**
   - Fintech Data: https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/fintech/
   - Payment System: https://www.bi.go.id/id/statistik/sistem-pembayaran/

3. **OJK**
   - Digital Finance: https://www.ojk.go.id/id/kanal/iknb/data-dan-statistik/fintech/
   - Roadmap: https://www.ojk.go.id/id/berita-dan-kegiatan/publikasi/

## Datasets untuk Development

### Public Datasets
1. **Elliptic Bitcoin Dataset**
   - Link: https://www.kaggle.com/ellipticco/elliptic-data-set
   - Size: 200k Bitcoin transactions with labels
   - Features: 166 features per transaction

2. **Ethereum Fraud Detection Dataset**
   - Link: https://www.kaggle.com/vagifa/ethereum-frauddetection-dataset
   - Size: 9841 addresses labeled

### Tools Open Source
1. **Ethereum ETL**
   - GitHub: https://github.com/blockchain-etl/ethereum-etl
   - Use: Export blockchain data to CSV/JSON

2. **Bitcoin ETL**
   - GitHub: https://github.com/blockchain-etl/bitcoin-etl
   - Use: Bitcoin blockchain data extraction

3. **Web3.py**
   - Docs: https://web3py.readthedocs.io/
   - Use: Ethereum interaction

## Catatan Penting

1. **Data Validation**: Selalu cross-check data dari multiple sources
2. **API Limits**: Perhatikan rate limits untuk free tier
3. **Privacy**: Gunakan aggregated data untuk compliance
4. **Updates**: Data kripto berubah cepat, update regular diperlukan

## Contact untuk Data Partnership

1. **BAPPEBTI**: pbk@kemendag.go.id
2. **PPATK**: dukungan@ppatk.go.id
3. **Asosiasi Blockchain Indonesia**: info@asosiasiblockchain.co.id

---
*Last updated: Desember 2024*