import { describe, expect, test } from 'vitest'
import request from 'supertest'

const BASE_URL = 'http://localhost:5000'

describe('Dog API - API tests', () => {
  test('Test 1: GET /api/dogs/random returns 200 and valid JSON', async () => {
    const res = await request(BASE_URL).get('/api/dogs/random')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('success', true)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toHaveProperty('imageUrl')
    expect(typeof res.body.data.imageUrl).toBe('string')
  })

  test('Test 2: GET invalid route returns 404 and correct error message', async () => {
    const res = await request(BASE_URL).get('/api/dogs/invalid')

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('success', false)
    expect(res.body).toHaveProperty('error')
    // Это из твоего server/index.ts (404 handler)
    expect(res.body.error).toBe('Route not found')
  })
})