export class Medida {
  constructor(
    public id?: string,
    public monstroId?: string,
    public data?: Date,
    public peso?: number,
    public gordura?: number,
    public gorduraVisceral?: number,
    public musculo?: number,
    public idadeCorporal?: number,
    public metabolismoBasal?: number,
    public indiceDeMassaCorporal?: number
  ) { }
}
