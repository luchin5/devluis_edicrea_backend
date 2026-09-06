/*import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/planos')
    },

    filename(req, file, cb) {
        const nombre = Date.now() + path.extname(file.originalname)

        cb(null, nombre)
    }
})

export default multer({
    storage,
    fileFilter(req, file, cb) {

        if (file.mimetype === 'image/svg+xml') {
            cb(null, true)
        } else {
            cb(new Error('Solo archivos SVG'))
        }

    }
})*/

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(
            null,
            'uploads/planos'
        );

    },

    filename(req, file, cb) {

        const nombre =
            Date.now() +
            path.extname(file.originalname).toLowerCase();

        cb(
            null,
            nombre
        );

    }

});

const upload = multer({

    storage,

    fileFilter(req, file, cb) {

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();

        if (extension === '.dwg') {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    'Solo archivos DWG'
                )
            );

        }

    }

});

export default upload;