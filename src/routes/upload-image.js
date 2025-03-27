import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Imagem não enviada' });

    const fileData = fs.readFileSync(file.path);
    const fileName = `${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from('services')
      .upload(fileName, fileData, {
        contentType: file.mimetype,
      });

    fs.unlinkSync(file.path); // remove o arquivo local após upload

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao subir imagem no Supabase' });
    }

    const { data: publicUrl } = supabase.storage
      .from('services')
      .getPublicUrl(fileName);

    return res.status(200).json({ url: publicUrl.publicUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no upload da imagem' });
  }
});

export default router;
