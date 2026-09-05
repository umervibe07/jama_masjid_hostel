Qur'an PDFs

The two supplied PDFs are stored at:
- public/quran/translation.pdf
- public/quran/urdu-arabic.pdf

These PDFs are large. Track them with Git LFS before pushing:
  git lfs install
  git lfs track "frontend/public/quran/*.pdf"
  git add .gitattributes frontend/public/quran/*.pdf

Vercel: Project Settings -> Git -> enable Git LFS, then redeploy. Vercel documents that when Git LFS support is enabled it pulls the LFS objects used by the repository.
