import { describe,expect, test, vi } from 'vitest'
import { app } from '..'
import request from 'supertest'

describe('Dog API',() => {
    test('GET /api/dogs/random returns correct output', async () => {
        const res = await request(app).get('/api/dogs/random')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toBeDefined()
        expect(res.body.data).toHaveProperty("imageUrl")
        expect(res.body.data.imageUrl).toBeTypeOf('string')
    })

    test('GET /api/dogs/invalid returns error', async () => {
        const res = await request(app).get('/api/dogs/invalid')

        expect(res.status).toBe(404)
        expect(res.body.error).toBeDefined()
        expect(res.body.success).toBe(false)
        expect(res.body.error).toBe("Route not found")

    })
})