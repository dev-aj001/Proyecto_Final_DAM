import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogTitle, Typography, TextField,
  DialogActions, Alert, Box, FormControlLabel, Checkbox, Button
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { useFormik } from "formik";
import * as Yup from "yup";
// Services
import { UpdateOneInventory } from "../services/remote/put/UpdateOneInventories";
import { getInventoryById } from "../services/remote/get/GetInventoriesById"; // Asegúrate de tener esta función en el servicio

