import * as tf from '@tensorflow/tfjs';

class RecommendationEngine {
    constructor() {
        this.model = null;
        this.categories = ['pasta', 'breakfast', 'snacks', 'vegetables'];
        this.learningRate = 0.01;
        this.history = {
            loss: [],
            accuracy: [],
            precision: [],
            f1: []
        };
        this.initModel();
    }

    async initModel() {
        // Simple sequential model
        this.model = tf.sequential();

        // Input layer: [timeOfDay, hasCartItems, lastCategoryViewedIndex]
        this.model.add(tf.layers.dense({
            units: 16,
            activation: 'relu',
            inputShape: [3]
        }));

        this.model.add(tf.layers.dense({
            units: 8,
            activation: 'relu'
        }));

        // Output layer: Probability for each category
        this.model.add(tf.layers.dense({
            units: this.categories.length,
            activation: 'softmax'
        }));

        this.model.compile({
            optimizer: tf.train.adam(this.learningRate),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });
    }

    // Convert category name to one-hot vector
    encodeCategory(category) {
        const index = this.categories.indexOf(category);
        return tf.oneHot(index, this.categories.length).reshape([1, this.categories.length]);
    }

    // Prepare input vector
    prepareInput(timeOfDay, hasCartItems, lastCategoryIndex) {
        // Normalize time (0-24) to 0-1
        const normTime = timeOfDay / 24;
        const cartStatus = hasCartItems ? 1 : 0;
        const normCat = lastCategoryIndex / (this.categories.length - 1 || 1);

        return tf.tensor2d([[normTime, cartStatus, normCat]]);
    }

    async train(userAction) {
        if (!this.model) await this.initModel();

        const { timeOfDay, hasCartItems, lastCategoryIndex, targetCategory } = userAction;

        const xs = this.prepareInput(timeOfDay, hasCartItems, lastCategoryIndex);
        const ys = this.encodeCategory(targetCategory);

        const history = await this.model.fit(xs, ys, {
            epochs: 1,
            batchSize: 1,
            verbose: 0
        });

        // Update metrics
        const loss = history.history.loss[0];
        const acc = history.history.acc[0];

        this.history.loss.push(loss);
        this.history.accuracy.push(acc);

        // Calculate pseudo-metrics for single sample (simulated for real-time feel)
        // In real app, you'd evaluate on a validation set
        const pred = this.model.predict(xs);
        const predData = await pred.data();
        const targetIndex = this.categories.indexOf(targetCategory);

        // Simple precision/recall simulation based on prediction confidence
        const confidence = predData[targetIndex];
        const precision = confidence > 0.5 ? 1 : 0; // Simplified
        const recall = confidence > 0.3 ? 1 : 0;    // Simplified
        const f1 = 2 * ((precision * recall) / (precision + recall + 0.0001));

        this.history.precision.push(precision);
        this.history.f1.push(f1);

        // Cleanup tensors
        xs.dispose();
        ys.dispose();
        pred.dispose();

        return {
            loss: loss.toFixed(4),
            accuracy: acc.toFixed(2),
            precision: precision.toFixed(2),
            f1: f1.toFixed(2)
        };
    }

    async predict(userContext) {
        if (!this.model) await this.initModel();

        const { timeOfDay, hasCartItems, lastCategoryIndex } = userContext;
        const xs = this.prepareInput(timeOfDay, hasCartItems, lastCategoryIndex);

        const prediction = this.model.predict(xs);
        const probabilities = await prediction.data();

        xs.dispose();
        prediction.dispose();

        // Map probabilities to categories
        const results = Array.from(probabilities).map((prob, i) => ({
            category: this.categories[i],
            probability: prob
        }));

        // Sort by probability
        return results.sort((a, b) => b.probability - a.probability);
    }
}

export const recommendationEngine = new RecommendationEngine();
