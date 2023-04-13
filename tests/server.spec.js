const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
    
    it("Obtiene un arreglo de objetos con un 200 de respuesta", async () => {
        const response = await request(server).get("/cafes").send();
        const status = response.statusCode;
        const body = response.body;
      
        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Array);
        expect(body[0]).toBeInstanceOf(Object);
    });

    it("Elimina un café con un id incorrecto y muestra error 404", async () => {
        const jwt = "token";
        const idDeProductoAEliminar = 6
        const { body: cafes } = await request(server).get("/cafes").send();
            
        const ids = cafes.map((cafe) => cafe.id);
        if(!ids.includes(idDeProductoAEliminar)) {
            const response = await request(server)
                .delete(`/cafes/${idDeProductoAEliminar}`)
                .set("Authorization", jwt)
                .send();
            expect(response.statusCode).toBe(404);
        }
    });

    it("Agrega un nuevo café y devuelve un código 201", async () => {
        const id = Math.floor(Math.random() * 999);
        const cafe = { id, nombre:"Nuevo café"};
          
        const response = await request(server)
            .post("/cafes")
            .send(cafe);
          
        const status = response.statusCode;
        const cafes = response.body;
          
        expect(status).toBe(201);
        expect(cafes).toContainEqual(cafe);
    });
          
    it("Devuelve un código 400 si el id es diferente", async () => {
        const jwt = "token";
        const idDeProductoAModificar = 4
        const cafe = {
            id: 2,
            nombre: "Café actualizado",
        };
        const response = await request(server)
            .put(`/cafes/${idDeProductoAModificar}`)
            .set("Authorization", jwt)
            .send(cafe);

        expect(response.statusCode).toBe(400);   
    });


});
