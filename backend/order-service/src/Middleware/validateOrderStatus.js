const validateOrderStatus = (req, res, next) => {
    const { status } = req.body;
    
    console.log("Validating order status:", status);
    // List of valid statuses from Order model
    const validStatuses = [
        'Pending',
        'Assigned',
        'Accepted',
        'PickedUp',
        'OnTheWay',
        'Delivered'
    ];

    // Check if status is valid
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            message: `Invalid status. Status must be one of: ${validStatuses.join(', ')}`
        });
    }

    // Define valid status transitions
    const validTransitions = {
        'Pending': ['Assigned'],
        'Assigned': ['Accepted'],
        'Accepted': ['PickedUp'],
        'PickedUp': ['OnTheWay'],
        'OnTheWay': ['Delivered'],
        'Delivered': [] // Terminal state
    };

    // Store valid transitions in request for use in service
    req.validTransitions = validTransitions;

    next();
};

module.exports = validateOrderStatus;