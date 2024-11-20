import React, { useEffect, useState } from "react";
// Material UI
import { MaterialReactTable } from 'material-react-table';
import { Box, Stack, Tooltip, IconButton, Dialog } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";

// DB
import { getAllInstitutes } from '../services/remote/get/GetAllInstitutes';
import { DeleteOneInstitute } from '../services/remote/delete/DeleteOneInstitute';
// Modals
import AddInstituteModal from "../modals/AddInstituteModal";
import UpdateInstituteModal from "../modals/UpdateInstituteModal";
import DeleteInstituteModal from "../modals/DeleteInstituteModal";

// Definir las columnas de la tabla
const InstitutesColumns = [
  { accessorKey: "IdInstitutoOK", header: "ID OK", size: 30 },
  { accessorKey: "IdInstitutoBK", header: "ID BK", size: 30 },
  { accessorKey: "DesInstituto", header: "INSTITUTO", size: 150 },
  { accessorKey: "Alias", header: "ALIAS", size: 50 },
  { accessorKey: "Matriz", header: "MATRIZ", size: 30 },
  { accessorKey: "IdTipoGiroOK", header: "GIRO", size: 150 },
  { accessorKey: "IdInstitutoSupOK", header: "ID OK SUP", size: 30 },
];

const InstitutesTable = () => {
  const [loadingTable, setLoadingTable] = useState(true);
  const [InstitutesData, setInstitutesData] = useState([]);
  const [AddInstituteShowModal, setAddInstituteShowModal] = useState(false);
  const [UpdateInstituteShowModal, setUpdateInstituteShowModal] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null); // Para almacenar el instituto seleccionado
  const [deleteInstituteShowModal, setDeleteInstituteShowModal] = useState(false); // Estado para controlar el modal de eliminación

  // Obtener datos
  const fetchData = async () => {
    try {
      const AllInstitutesData = await getAllInstitutes();
      setInstitutesData(AllInstitutesData);
      setLoadingTable(false);
    } catch (error) {
      console.error("Error al obtener los institutos:", error);
    }
  };

  // Eliminar instituto (ahora lo manejamos desde el modal)
  const handleDeleteInstitute = () => {
    if (selectedInstitute) {
      setDeleteInstituteShowModal(true); // Mostrar el modal de eliminación
    }
  };

  // Cargar datos al cargar el componente
  useEffect(() => {
    fetchData();
  },[]);

  return (
    <Box>
      <MaterialReactTable
        columns={InstitutesColumns}
        data={InstitutesData}
        state={{ isLoading: loadingTable }}
        initialState={{ density: "compact", showGlobalFilter: true }}
        renderTopToolbarCustomActions={({ table }) => (
          <Stack direction="row" sx={{ m: 1 }}>
            <Box>
              <Tooltip title="Agregar">
                <IconButton onClick={() => setAddInstituteShowModal(true)}>
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton onClick={() => setUpdateInstituteShowModal(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton onClick={() => setDeleteInstituteShowModal(true)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Detalles">
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        )}
        onRowClick={(row) => {
          setSelectedInstitute(row.original); // Establecer el instituto seleccionado al hacer clic en una fila
        }}
      />

      {/* Modal de agregar instituto */}
      <Dialog open={AddInstituteShowModal}>
        <AddInstituteModal
          AddInstituteShowModal={AddInstituteShowModal}
          setAddInstituteShowModal={setAddInstituteShowModal}
          UpdateTable={fetchData}
          onClose={() => setAddInstituteShowModal(false)}
        />
      </Dialog>

      {/* Modal de actualización de instituto */}
      <Dialog open={UpdateInstituteShowModal}>
        <UpdateInstituteModal
          UpdateInstituteShowModal={UpdateInstituteShowModal}
          setUpdateInstituteShowModal={setUpdateInstituteShowModal}
          UpdateTable={fetchData}
          onInstituteUpdated={fetchData}
        />
      </Dialog>

      {/* Modal de eliminación de instituto */}
      <DeleteInstituteModal
        deleteInstituteShowModal={deleteInstituteShowModal}
        setDeleteInstituteShowModal={setDeleteInstituteShowModal}
        onInstituteDeleted={fetchData}
        instituteId={selectedInstitute ? selectedInstitute.IdInstitutoOK : null}
      />
    </Box>
  );
};

export default InstitutesTable;
