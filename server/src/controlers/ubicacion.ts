import express, { Request, Response } from 'express';
import Ubicacion from '../models/ubicacion';


const app = express();

export const obtenerUbicacion = async (req: Request, res: Response) => {
    try {
        const Ubicaciones = await Ubicacion.findAll();
        res.status(200).json(Ubicaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener bicicleta ubicacion' });
    }
};


export const crearUbicacion = async (req: Request, res: Response) => {
    try {
        const nuevaUbicacion = await Ubicacion.create(req.body);
        res.status(201).json(nuevaUbicacion);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear bicicleta' });
    }
};


export const eliminarUbicacion = async (req: Request, res: Response) => {
    const { LocationID } = req.params;

    try {
        const ubicacion = await Ubicacion.findByPk(LocationID);

        if (ubicacion) {
            // Verificar que Bicicleta.sequelize no sea undefined antes de usarlo
            if (Ubicacion.sequelize) {
                // Inicia una transacción manualmente
                const t = await Ubicacion.sequelize.transaction();

                try {
                    // Elimina la bicicleta de la tabla propietarioBicicleta dentro de la transacción
                    await Ubicacion.destroy({ where: { LocationID: ubicacion.getDataValue('LocationID') }, transaction: t });

                    // Luego, elimina la bicicleta de la tabla Bicicleta
                    await ubicacion.destroy({ transaction: t });

                    // Hace commit de la transacción si todo fue exitoso
                    await t.commit();

                    res.status(204).send();
                } catch (error) {
                    // En caso de error, realiza un rollback de la transacción
                    await t.rollback();
                    res.status(500).json({ error: 'Error al eliminar ubicación' });
                }
            } else {
                res.status(500).json({ error: 'Error al obtener sequelize de ubicación' });
            }
        } else {
            res.status(404).json({ mensaje: 'Ubicación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar ubicación' });
    }
};
