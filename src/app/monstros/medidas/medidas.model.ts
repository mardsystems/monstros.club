export interface Medida {
  id?: string;
  monstroId?: string;
  data?: firebase.firestore.Timestamp;
  peso?: number;
  gordura?: number;
  gorduraVisceral?: number;
  musculo?: number;
  idadeCorporal?: number;
  metabolismoBasal?: number;
  indiceDeMassaCorporal?: number;
}
